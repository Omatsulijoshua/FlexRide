# FlexRide Launch Verification

Run the feature coverage verifier:

```powershell
.\scripts\verify-production-readiness.ps1
```

Latest observed result:

```text
PASS: 42
PARTIAL: 0
MISSING: 0
TOTAL: 42
```

Run the stricter launch gate:

```powershell
.\scripts\verify-launch-gate.ps1
```

For a backend/admin-only pass:

```powershell
.\scripts\verify-launch-gate.ps1 -SkipMobile
```

The launch gate runs:

- production readiness checklist
- every backend service `npm run build`
- backend Jest suites where present
- admin dashboard production build
- customer Flutter analyze/test
- driver Flutter analyze/test

Latest directly verified commands:

```powershell
.\scripts\verify-production-readiness.ps1
npm run build # analytics-service, api-gateway, auth-service, dispatch-service, driver-service, fraud-service, interstate-service, notification-service, payment-service, ride-service, tracking-service, user-service
npm test -- --runInBand # api-gateway, dispatch-service, payment-service
npm run build # admin-dashboard
flutter analyze --no-pub # customer_app, driver_app
flutter test --no-pub # customer_app, driver_app
```

Observed status: all commands above pass locally.

Note: Flutter and Jest output can be slow on this Windows workstation. If a monolithic launch-gate run exceeds the terminal timeout, run the backend/admin gate and mobile commands separately.
