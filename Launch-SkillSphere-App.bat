@echo off
title SkillSphere 3D Desktop App
echo ========================================================
echo   Launching SkillSphere 3D as a Standalone Desktop App
echo ========================================================

:: Check if Edge or Chrome exists for native chromeless App Mode
where msedge >nul 2>nul
if %errorlevel% == 0 (
    start msedge --app=https://eggs-matters-freeze-examinations.trycloudflare.com --window-size=1280,820
    exit
)

where chrome >nul 2>nul
if %errorlevel% == 0 (
    start chrome --app=https://eggs-matters-freeze-examinations.trycloudflare.com --window-size=1280,820
    exit
)

:: Fallback to default browser
start https://eggs-matters-freeze-examinations.trycloudflare.com
exit
