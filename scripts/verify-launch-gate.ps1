param(
  [switch]$SkipMobile,
  [switch]$SkipAdmin
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path ".").Path
$startedAt = Get-Date

function Invoke-LaunchCommand {
  param(
    [string]$Name,
    [string]$WorkDir,
    [scriptblock]$Command
  )

  $absoluteWorkDir = Join-Path $root $WorkDir
  $stepStartedAt = Get-Date

  if (-not (Test-Path -LiteralPath $absoluteWorkDir)) {
    return [pscustomobject]@{
      name = $Name
      workDir = $WorkDir
      status = "FAIL"
      exitCode = 1
      durationSeconds = 0
      output = "Work directory not found: $WorkDir"
    }
  }

  Push-Location $absoluteWorkDir
  try {
    Write-Host ""
    Write-Host "Running $Name"
    $global:LASTEXITCODE = 0
    & $Command | Out-Host
    $exitCode = $global:LASTEXITCODE
    if (-not $?) { $exitCode = 1 }
    $status = if ($exitCode -eq 0) { "PASS" } else { "FAIL" }

    return [pscustomobject]@{
      name = $Name
      workDir = $WorkDir
      status = $status
      exitCode = $exitCode
      durationSeconds = [math]::Round(((Get-Date) - $stepStartedAt).TotalSeconds, 2)
      output = ""
    }
  } catch {
    return [pscustomobject]@{
      name = $Name
      workDir = $WorkDir
      status = "FAIL"
      exitCode = 1
      durationSeconds = [math]::Round(((Get-Date) - $stepStartedAt).TotalSeconds, 2)
      output = $_.Exception.Message
    }
  } finally {
    Pop-Location
    $global:LASTEXITCODE = 0
  }
}

function Test-NpmScript {
  param(
    [string]$WorkDir,
    [string]$ScriptName
  )

  $packagePath = Join-Path (Join-Path $root $WorkDir) "package.json"
  if (-not (Test-Path -LiteralPath $packagePath)) { return $false }
  $package = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
  return $package.scripts.PSObject.Properties.Name -contains $ScriptName
}

$steps = New-Object System.Collections.Generic.List[object]

$readinessScript = Join-Path $root "scripts\verify-production-readiness.ps1"
[void]$steps.Add((Invoke-LaunchCommand "production-readiness-checklist" "." { & $readinessScript }))

$backendServices = Get-ChildItem -LiteralPath (Join-Path $root "backend") -Directory |
  Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName "package.json") } |
  Sort-Object Name

foreach ($service in $backendServices) {
  $relativePath = "backend/$($service.Name)"
  if (Test-NpmScript $relativePath "build") {
    [void]$steps.Add((Invoke-LaunchCommand "$($service.Name):build" $relativePath { npm run build }))
  }
  if (Test-NpmScript $relativePath "test") {
    [void]$steps.Add((Invoke-LaunchCommand "$($service.Name):test" $relativePath { npm test -- --runInBand }))
  }
}

if (-not $SkipAdmin) {
  if (Test-NpmScript "admin-dashboard" "build") {
    [void]$steps.Add((Invoke-LaunchCommand "admin-dashboard:build" "admin-dashboard" { npm run build }))
  }
}

if (-not $SkipMobile) {
  foreach ($app in @("customer_app", "driver_app")) {
    [void]$steps.Add((Invoke-LaunchCommand "${app}:flutter-analyze" $app { flutter analyze --no-pub }))
    [void]$steps.Add((Invoke-LaunchCommand "${app}:flutter-test" $app { flutter test --no-pub }))
  }
}

$failed = @($steps | Where-Object status -eq "FAIL")
$summary = [pscustomobject]@{
  project = "FlexRide"
  generatedAt = (Get-Date).ToString("s")
  durationSeconds = [math]::Round(((Get-Date) - $startedAt).TotalSeconds, 2)
  total = $steps.Count
  pass = @($steps | Where-Object status -eq "PASS").Count
  fail = $failed.Count
  steps = $steps
}

Write-Host ""
Write-Host "FlexRide Launch Gate"
Write-Host "PASS: $($summary.pass)  FAIL: $($summary.fail)  TOTAL: $($summary.total)"
Write-Host ""

foreach ($step in $summary.steps) {
  Write-Host ("[{0}] {1} ({2}s)" -f $step.status, $step.name, $step.durationSeconds)
  if ($step.status -eq "FAIL") {
    $lines = @($step.output -split "`n" | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Last 12)
    foreach ($line in $lines) {
      Write-Host "  $line"
    }
  }
}

if ($summary.fail -gt 0) {
  exit 1
}
