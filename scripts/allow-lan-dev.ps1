# 개발용 LAN 포트 허용 — 관리자 PowerShell에서 실행
# 예: powershell -ExecutionPolicy Bypass -File scripts/allow-lan-dev.ps1

$rules = @(
  @{ Name = 'Schedule Dev Vite (5173)'; Port = 5173 },
  @{ Name = 'Schedule Dev Backend (5000)'; Port = 5000 }
)

foreach ($rule in $rules) {
  $existing = netsh advfirewall firewall show rule name=$($rule.Name) 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "이미 있음: $($rule.Name)"
    continue
  }

  netsh advfirewall firewall add rule `
    name=$($rule.Name) `
    dir=in action=allow protocol=TCP localport=$($rule.Port) | Out-Null

  Write-Host "추가됨: $($rule.Name) (TCP $($rule.Port))"
}

Write-Host ''
Write-Host '완료. Vite 터미널의 Network 주소(예: http://172.x.x.x:5173)로 폰에서 접속하세요.'
