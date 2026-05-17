@echo off
:: This runs silently on startup - no visible window
:: It starts the Node backend and Vite in minimized windows

:: Wait for XAMPP MySQL to be ready (10 second delay)
timeout /t 10 /nobreak > nul

:: Start Node.js backend
start "Tiffy Backend" /min cmd /k "cd /d "C:\Users\kalit\OneDrive\Desktop\tiffy\server" && node server.js"

:: Wait a moment then start Vite
timeout /t 3 /nobreak > nul
start "Tiffy Frontend" /min cmd /k "cd /d "C:\Users\kalit\OneDrive\Desktop\tiffy" && node node_modules/.bin/vite"
