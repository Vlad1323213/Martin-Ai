@echo off
title LocalTunnel для Telegram Mini App
color 0A
echo ============================================
echo    ЗАПУСК LOCALTUNNEL
echo ============================================
echo.
echo Запускаю туннель на порт 3001...
echo.
echo ВАЖНО: Копируйте URL который появится ниже!
echo.
echo ============================================
echo.
call npx --yes localtunnel --port 3001
pause

