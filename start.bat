//start.bat

@echo off
cd /d %~dp0
echo Starting Ghost bot...
call npm install
call node index.mjs
pause
