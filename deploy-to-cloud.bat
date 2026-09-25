@echo off
title Deploy SkillSphere 3D to Independent Cloud
echo ========================================================
echo   SkillSphere 3D: Independent Free Cloud Deployer
echo ========================================================
echo Choose your preferred independent cloud hosting platform:
echo [1] Deploy to Vercel (Instant Global Edge CDN)
echo [2] Deploy to Firebase Hosting (Google Cloud Infrastructure)
echo [3] Deploy to Netlify
echo.
set /p choice="Enter choice (1, 2, or 3): "

if "%choice%"=="1" (
    echo.
    echo Deploying to Vercel Cloud...
    cd frontend
    npx vercel --prod
    pause
    exit
)

if "%choice%"=="2" (
    echo.
    echo Deploying to Firebase Cloud...
    firebase deploy
    pause
    exit
)

if "%choice%"=="3" (
    echo.
    echo Deploying to Netlify Cloud...
    cd frontend
    npx netlify deploy --prod --dir=dist
    pause
    exit
)

echo Invalid choice.
pause
