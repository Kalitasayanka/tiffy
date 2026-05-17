@echo off
title Tiffy Launcher
color 0A

echo ================================================
echo            TIFFY - Starting All Services
echo ================================================
echo.

:: Check if Node.js backend is already running on port 5000
netstat -an | find "5000" | find "LISTENING" > nul 2>&1
if not errorlevel 1 (
    echo [OK] Node.js backend already running on port 5000.
) else (
    echo [..] Starting Node.js backend server...
    start "Tiffy Backend" /min cmd /k "cd /d "%~dp0server" && node server.js"
    timeout /t 2 /nobreak > nul
    echo [OK] Backend started on http://localhost:5000
)

:: Check if Vite dev server is already running on port 5173
netstat -an | find "5173" | find "LISTENING" > nul 2>&1
if not errorlevel 1 (
    echo [OK] Vite frontend already running on port 5173.
) else (
    echo [..] Starting Vite frontend server...
    start "Tiffy Frontend" /min cmd /k "cd /d "%~dp0" && node node_modules/.bin/vite"
    timeout /t 3 /nobreak > nul
    echo [OK] Frontend started on http://localhost:5173
)

echo.
echo ================================================
echo   All services running! Opening browser...
echo ================================================
echo.
echo   Homepage : http://localhost:5173/tiffy/
echo   Admin    : http://localhost:5173/tiffy/admin
echo.

timeout /t 2 /nobreak > nul
start "" "http://localhost:5173/tiffy/"

echo Press any key to stop all Tiffy servers...
pause > nul

:: Cleanup: kill both server windows
taskkill /fi "WindowTitle eq Tiffy Backend*" /t /f > nul 2>&1
taskkill /fi "WindowTitle eq Tiffy Frontend*" /t /f > nul 2>&1
echo All Tiffy servers stopped.
