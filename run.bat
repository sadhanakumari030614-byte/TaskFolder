@echo off
title TaskFlow - Start Project

cd /d "%~dp0"

echo ========================================
echo          TASKFLOW PROJECT
echo ========================================
echo.

echo Starting Backend...
start "TaskFlow Backend" cmd /k "py -3.13 -m uvicorn backend.main:app --reload"

echo Starting Frontend...
start "TaskFlow Frontend" cmd /k "py -3.13 -m http.server 5500 --directory frontend"

timeout /t 2 /nobreak >nul

echo Opening TaskFlow website...
start "" http://127.0.0.1:5500

echo Opening FastAPI documentation...
start "" http://127.0.0.1:8000/docs

echo.
echo TaskFlow is starting...
echo Keep the terminal windows open while using the project.

pause