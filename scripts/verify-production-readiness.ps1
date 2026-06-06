param(
  [string]$ChecklistPath = "docs/production-readiness-checklist.json",
  [switch]$Json
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path ".").Path
$checklistFullPath = Join-Path $root $ChecklistPath

if (-not (Test-Path -LiteralPath $checklistFullPath)) {
  throw "Checklist not found: $checklistFullPath"
}

$checklist = Get-Content -LiteralPath $checklistFullPath -Raw | ConvertFrom-Json

function Resolve-ProjectPath {
  param([string]$RelativePath)
  if ($RelativePath -eq "." -or [string]::IsNullOrWhiteSpace($RelativePath)) {
    return $root
  }
  return Join-Path $root $RelativePath
}

function Read-TextTarget {
  param([string]$RelativePath)
  $target = Resolve-ProjectPath $RelativePath
  if (-not (Test-Path -LiteralPath $target)) {
    return ""
  }

  $item = Get-Item -LiteralPath $target
  if ($item.PSIsContainer) {
    $files = Get-ChildItem -LiteralPath $target -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object {
        $_.FullName -notmatch "\\(node_modules|build|\.dart_tool|ephemeral)\\" -and
        $_.Extension -in @(".ts", ".tsx", ".js", ".jsx", ".dart", ".sql", ".yaml", ".yml", ".json", ".md", ".css", ".html", ".xml", ".kt", ".swift")
      }
    $chunks = foreach ($file in $files) {
      try { Get-Content -LiteralPath $file.FullName -Raw -ErrorAction Stop } catch { "" }
    }
    return ($chunks -join "`n")
  }

  try {
    return Get-Content -LiteralPath $target -Raw -ErrorAction Stop
  } catch {
    return ""
  }
}

function Test-Check {
  param($Check)

  $type = [string]$Check.type
  $path = [string]$Check.path
  $target = Resolve-ProjectPath $path

  switch ($type) {
    "pathExists" {
      return Test-Path -LiteralPath $target
    }
    "textSearch" {
      if (-not (Test-Path -LiteralPath $target)) { return $false }
      $item = Get-Item -LiteralPath $target
      if ($item.PSIsContainer) {
        & rg --fixed-strings --quiet --glob '!**/node_modules/**' --glob '!**/build/**' --glob '!**/.dart_tool/**' --glob '!**/ephemeral/**' -- ([string]$Check.pattern) $target
        return $LASTEXITCODE -eq 0
      }
      $text = Read-TextTarget $path
      return $text -match [regex]::Escape([string]$Check.pattern)
    }
    "textSearchAbsent" {
      if (-not (Test-Path -LiteralPath $target)) { return $false }
      $item = Get-Item -LiteralPath $target
      if ($item.PSIsContainer) {
        & rg --fixed-strings --quiet --glob '!**/node_modules/**' --glob '!**/build/**' --glob '!**/.dart_tool/**' --glob '!**/ephemeral/**' -- ([string]$Check.pattern) $target
        return $LASTEXITCODE -ne 0
      }
      $text = Read-TextTarget $path
      if ([string]::IsNullOrEmpty($text)) { return $false }
      return -not ($text -match [regex]::Escape([string]$Check.pattern))
    }
    "jsonDependency" {
      if (-not (Test-Path -LiteralPath $target)) { return $false }
      $json = Get-Content -LiteralPath $target -Raw | ConvertFrom-Json
      $name = [string]$Check.name
      return (($json.dependencies.PSObject.Properties.Name -contains $name) -or ($json.devDependencies.PSObject.Properties.Name -contains $name))
    }
    "flutterDependency" {
      $text = Read-TextTarget $path
      return $text -match "(?m)^\s+$([regex]::Escape([string]$Check.name))\s*:"
    }
    "dbTable" {
      $text = Read-TextTarget $path
      return $text -match "(?is)create\s+table\s+(if\s+not\s+exists\s+)?$([regex]::Escape([string]$Check.name))\b"
    }
    "dockerService" {
      $text = Read-TextTarget $path
      return $text -match "(?m)^\s{2}$([regex]::Escape([string]$Check.name))\s*:"
    }
    default {
      return $false
    }
  }
}

$results = foreach ($item in $checklist.items) {
  $checks = @($item.checks)
  $passedChecks = 0
  $checkResults = foreach ($check in $checks) {
    $passed = Test-Check $check
    if ($passed) { $passedChecks++ }
    [pscustomobject]@{
      type = $check.type
      path = $check.path
      pattern = $check.pattern
      name = $check.name
      passed = $passed
    }
  }

  $status = if ($passedChecks -eq $checks.Count) {
    "PASS"
  } elseif ($passedChecks -gt 0) {
    "PARTIAL"
  } else {
    "MISSING"
  }

  [pscustomobject]@{
    id = $item.id
    category = $item.category
    requirement = $item.requirement
    status = $status
    passedChecks = $passedChecks
    totalChecks = $checks.Count
    checks = $checkResults
  }
}

$summary = [pscustomobject]@{
  project = $checklist.project
  generatedAt = (Get-Date).ToString("s")
  total = $results.Count
  pass = @($results | Where-Object status -eq "PASS").Count
  partial = @($results | Where-Object status -eq "PARTIAL").Count
  missing = @($results | Where-Object status -eq "MISSING").Count
  results = $results
}

if ($Json) {
  $summary | ConvertTo-Json -Depth 8
  exit 0
}

Write-Host "Flex Ride Production Readiness"
Write-Host "PASS: $($summary.pass)  PARTIAL: $($summary.partial)  MISSING: $($summary.missing)  TOTAL: $($summary.total)"
Write-Host ""

$summary.results |
  Sort-Object status, category, id |
  ForEach-Object {
    $line = "[{0}] {1} - {2}/{3} - {4}" -f $_.status, $_.id, $_.passedChecks, $_.totalChecks, $_.requirement
    Write-Host $line
  }

if ($summary.missing -gt 0 -or $summary.partial -gt 0) {
  exit 1
}
