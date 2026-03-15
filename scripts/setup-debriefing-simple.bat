@echo off
REM Mission Control v2 Debriefing System Setup
REM Simple batch file for Windows setup

echo.
echo ========================================
echo   MISSION CONTROL v2 DEBRIEFING SYSTEM
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js not found in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Test debriefing system
echo Testing debriefing system...
node scripts/debriefing.js test
if %errorlevel% neq 0 (
    echo ❌ ERROR: Debriefing test failed
    pause
    exit /b 1
)

echo.
echo ✅ System test passed
echo.

REM Create scheduled tasks
echo Creating scheduled tasks...
echo.

REM Task 1: Daily Morning (7 AM CST / 8 AM EST)
echo Creating Daily Morning task...
schtasks /create /tn "Mission Control Daily Morning Debriefing" ^
  /tr "node \"%~dp0..\scripts\debriefing.js\" daily" ^
  /sc daily /st 07:00 /ru SYSTEM /rl HIGHEST ^
  /f
if %errorlevel% equ 0 echo ✅ Daily Morning task created

echo.

REM Task 2: Daily Evening (5 PM CST / 6 PM EST)
echo Creating Daily Evening task...
schtasks /create /tn "Mission Control Daily Evening Debriefing" ^
  /tr "node \"%~dp0..\scripts\debriefing.js\" daily" ^
  /sc daily /st 17:00 /ru SYSTEM /rl HIGHEST ^
  /f
if %errorlevel% equ 0 echo ✅ Daily Evening task created

echo.

REM Task 3: Weekly (Sunday 9 AM CST / 10 AM EST)
echo Creating Weekly task...
schtasks /create /tn "Mission Control Weekly Debriefing" ^
  /tr "node \"%~dp0..\scripts\debriefing.js\" weekly" ^
  /sc weekly /d SUN /st 09:00 /ru SYSTEM /rl HIGHEST ^
  /f
if %errorlevel% equ 0 echo ✅ Weekly task created

echo.
echo ========================================
echo            SETUP COMPLETE
echo ========================================
echo.
echo ✅ Debriefing system installed successfully!
echo.
echo Schedule:
echo • Daily Morning: 7:00 AM CST (8:00 AM EST)
echo • Daily Evening: 5:00 PM CST (6:00 PM EST)
echo • Weekly: Sunday 9:00 AM CST (10:00 AM EST)
echo.
echo Files:
echo • Logs: %~dp0..\debriefing.log
echo • Stats: %~dp0..\debriefing-stats.json
echo • Archive: %~dp0..\debriefing-archive\
echo.
echo To test manually:
echo   node scripts/debriefing.js daily
echo   node scripts/debriefing.js weekly
echo.
echo To remove tasks:
echo   schtasks /delete /tn "Mission Control Daily Morning Debriefing" /f
echo   schtasks /delete /tn "Mission Control Daily Evening Debriefing" /f
echo   schtasks /delete /tn "Mission Control Weekly Debriefing" /f
echo.
pause