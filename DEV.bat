@echo off
title BitToByte dev
cd /d "%~dp0"

echo Checking dependencies...
call pnpm install --frozen-lockfile
if errorlevel 1 (
  echo.
  echo pnpm install failed. Read the error above, fix it, then run DEV.bat again.
  pause
  exit /b 1
)

echo Starting dev servers...
call pnpm run dev

echo.
echo Dev servers stopped.
pause
