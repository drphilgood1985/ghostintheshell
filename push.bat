//push.bat

@echo off
cd /d C:\Projects\Ghost

echo * Initializing git repository...
git init

echo * Adding remote origin...
git remote add origin https://github.com/drphilgood1985/ghostintheshell

echo * Staging all files...
git add .

echo * Creating commit...
git commit -m "Initial commit of Ghost bot system"

echo * Setting branch to main...
git branch -M main

echo > Pushing to GitHub...
git push -u origin main

echo ✓ Push complete. Ghost has entered the shell.

