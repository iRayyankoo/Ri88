@echo off
title Rayyan Beta Server
color 0A
:loop
echo.
echo ==================================================
echo      STARTING RAYYAN BETA SERVER...
echo      PLEASE DO NOT CLOSE THIS WINDOW!
echo ==================================================
echo.
echo Stopping old servers...
taskkill /F /IM node.exe >nul 2>&1
echo.
echo Starting server...
echo The website will open automatically when ready.
echo.
start "" "http://localhost:3000/beta"
cd /d "%~dp0"
call npm run dev
echo.
echo Server stopped or crashed. Restarting in 3 seconds...
timeout /t 3
goto loop
