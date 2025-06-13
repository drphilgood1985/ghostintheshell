//start.bat

@echo off
cd /d %~dp0
echo [*] Swapping GitHub identity to drphilgood1985...

REM === Step 1: Remove saved GitHub credentials
echo [*] Opening Windows Credential Manager...
rundll32.exe keymgr.dll,KRShowKeyMgr

echo [✓] If any github.com entries were removed, close the window and continue.

REM === Step 2: Set SSH remote for this repo
echo [*] Resetting remote to use SSH for ghostintheshell...
git remote set-url origin git@github.com:drphilgood1985/ghostintheshell.git

REM === Step 3: Ensure we're on main branch
echo [*] Switching to main branch...
git checkout main

REM === Step 4: Pull latest from origin
echo [>] Pulling latest changes via SSH...
git pull origin main

echo [✓] GitHub identity switched to drphilgood1985@ghostintheshell.
pause
