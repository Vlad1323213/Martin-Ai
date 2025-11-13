# Запуск localtunnel и вывод URL
$process = Start-Process npx -ArgumentList "--yes", "localtunnel", "--port", "3001" -PassThru -RedirectStandardOutput "tunnel-output.txt" -RedirectStandardError "tunnel-error.txt" -NoNewWindow

Write-Host "Туннель запускается... Ожидайте URL..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

if (Test-Path "tunnel-output.txt") {
    $content = Get-Content "tunnel-output.txt" -Raw
    Write-Host $content
    
    # Извлекаем URL
    if ($content -match "https://[a-z0-9\-]+\.loca\.lt") {
        $url = $matches[0]
        Write-Host "`n==========================================" -ForegroundColor Green
        Write-Host "  ВАШ URL:" -ForegroundColor Yellow
        Write-Host "  $url" -ForegroundColor Cyan
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host "`nСкопируйте этот URL и используйте в BotFather!" -ForegroundColor Magenta
    }
}

if (Test-Path "tunnel-error.txt") {
    $errors = Get-Content "tunnel-error.txt" -Raw
    if ($errors) {
        Write-Host "`nОшибки:" -ForegroundColor Red
        Write-Host $errors
    }
}

Write-Host "`nПроцесс туннеля запущен (PID: $($process.Id))" -ForegroundColor Green
Write-Host "Туннель работает в фоновом режиме..." -ForegroundColor Yellow






