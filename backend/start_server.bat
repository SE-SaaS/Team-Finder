@echo off
echo ========================================
echo Starting University Career Assistant API
echo Powered by Claude (Anthropic)
echo ========================================
echo.

cd /d "%~dp0"

echo Checking environment...
if not exist "..\\.env" (
    echo ERROR: .env file not found!
    echo Please create .env file with ANTHROPIC_API_KEY and DATABASE_URL
    pause
    exit /b 1
)

echo Starting FastAPI server on http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

python app/main.py
pause
