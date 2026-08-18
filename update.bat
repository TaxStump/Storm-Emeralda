@echo off
setlocal
cd /d "%~dp0"

echo ==============================================
echo   Storm Emeralda - Deploy ke Netlify
echo ==============================================
echo.

rem Ambil timestamp untuk nama commit (format: yyyyMMdd-HHmmss)
for /f "delims=" %%i in ('powershell -NoProfile -Command "Get-Date -Format 'yyyyMMdd-HHmmss'"') do set "TS=%%i"

git add -A

git commit -m "update %TS%" >nul 2>&1
if errorlevel 1 (
    echo [skip] Tidak ada perubahan baru.
) else (
    echo [ok]   Perubahan di-commit: update %TS%
)

echo.
echo Push ke GitHub...
git push

echo.
echo ==============================================
echo   Selesai! Netlify auto-deploy dalam beberapa detik.
echo   URL: https://stormemeralda.netlify.app
echo ==============================================
echo.
pause
endlocal
