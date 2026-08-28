$ErrorActionPreference = "Stop"
$repo = "B-Divyesh/sf-photo-upload-audit"
$release = Invoke-RestMethod "https://api.github.com/repos/$repo/releases/latest"
$asset = $release.assets | Where-Object { $_.name -match '\.(msi|exe)$' } | Select-Object -First 1
if (-not $asset) { throw "No Windows installer is published yet." }
$temp = Join-Path $env:TEMP $asset.name
Invoke-WebRequest $asset.browser_download_url -OutFile $temp
$sums = (Invoke-WebRequest "https://github.com/$repo/releases/latest/download/SHA256SUMS").Content
$expected = (($sums -split "`n") | Where-Object { $_ -match [regex]::Escape($asset.name) } | Select-Object -First 1) -split '\s+' | Select-Object -First 1
$actual = (Get-FileHash $temp -Algorithm SHA256).Hash.ToLower()
if ($actual -ne $expected.ToLower()) { Remove-Item $temp; throw "The installer checksum did not match." }
Write-Host "Verified $($asset.name). Starting the installer…"
Start-Process $temp
