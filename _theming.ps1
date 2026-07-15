$ErrorActionPreference = 'Stop'
$files = @('public\css\farmer-dashboard.css', 'public\css\crop-management.css')
foreach ($f in $files) {
    $c = Get-Content $f -Raw
    $c = $c -creplace '#1C1C1A','#23501F'
    $c = $c -creplace '#3B3B38','#2E5A2A'
    $c = $c -creplace '#F7F5F0','#EEF3E5'
    $c = $c -creplace '#EFEDE7','#E2EBD7'
    $c = $c -creplace '#E2DFD8','#D2DCC4'
    $c = $c -creplace '#E8E5DE','#DCE6CF'
    $c = $c -creplace '#D6D3CB','#C7D3B8'
    $c = $c -creplace '#F0EDE8','#E2EBD7'
    $c = $c -creplace '#5A5854','#46523F'
    $c = $c -creplace '#7A7773','#68735C'
    $c = $c -creplace '#9A9790','#86927A'
    $c = $c -creplace '#B0ADA5','#A4B0A0'
    $c = $c -creplace '#C2BFB7','#B3BFA5'
    $c = $c -replace 'rgba\(28, 28, 26', 'rgba(35, 80, 31'
    $c = $c -replace 'rgba\(28,28,26', 'rgba(35, 80, 31'
    Set-Content -Path $f -Value $c -NoNewline -Encoding UTF8
}
Write-Output 'done'