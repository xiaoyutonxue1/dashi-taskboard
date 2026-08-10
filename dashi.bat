@echo off
chcp 65001 >nul 2>&1
title Dashi Taskboard Launcher
cd /d "%~dp0"

echo ========================================
echo   Dashi Taskboard Launcher
echo ========================================
echo.

:: Check if ChatGPT is already running
tasklist /FI "IMAGENAME eq ChatGPT.exe" /NH 2>nul | find /i "ChatGPT.exe" >nul
if %errorlevel% equ 0 (
    echo [!] Codex is already running.
    echo     The taskboard needs Codex to start with a debugging port.
    echo     Please close all Codex windows first, then run this again.
    echo.
    pause
    exit /b 1
)

echo [*] Starting Codex with taskboard...
echo     Service:  http://127.0.0.1:47823
echo     CDP:      http://127.0.0.1:9229
echo.
echo     Press Ctrl+C to stop (will close taskboard and Codex CDP).
echo.

set CODEX_TASKBOARD_HOST=127.0.0.1
call npm run codex

if %errorlevel% neq 0 (
    echo.
    echo [!] Error: %errorlevel%
    echo     If npm is not found, make sure Node.js is installed.
    echo.
)

echo.
echo [*] Taskboard stopped.
pause
