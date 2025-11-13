@echo off
chcp 65001 >nul
echo ========================================
echo   ПОЛУЧЕНИЕ URL ТУННЕЛЯ
echo ========================================
echo.
echo Запускаю туннель и сохраняю URL...
echo.
start /B npx --yes localtunnel --port 3001 > tunnel_url.txt 2>&1
timeout /t 15 /nobreak >nul
echo.
echo URL туннеля:
echo.
type tunnel_url.txt | findstr "your url is"
echo.
echo ========================================
echo.
echo Скопируйте URL выше!
echo.
pause






