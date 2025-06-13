@echo off
cd /d %~dp0
echo [OK] Applying patch to ghost.mjs and gabby.mjs...

setlocal enabledelayedexpansion

REM === Patch ghost.mjs ===
set "ghostfile=assistants\ghost.mjs"
set "ghosttemp=ghost_temp.mjs"
break > "!ghosttemp!"

for /f "usebackq delims=" %%L in ("!ghostfile!") do (
  set "line=%%L"
  echo !line! | findstr /C:"NEQ=" >nul
  if !errorlevel! equ 0 (
    echo if ^(!handleUserMessage ^|^| typeof handleUserMessage !== 'function'^) {>>"!ghosttemp!"
    echo if ^(!handleJasonTask ^|^| typeof handleJasonTask !== 'function'^) {>>"!ghosttemp!"
  )
  if !errorlevel! neq 0 (
    >>"!ghosttemp!" echo !line!
  )
)
move /Y "!ghosttemp!" "!ghostfile!" >nul
echo [->] Fixed ghost.mjs function checks.

REM === Patch gabby.mjs (inject memory into OpenAI messages)
set "gabbyfile=assistants\gabby.mjs"
set "gabbytemp=gabby_temp.mjs"
break > "!gabbytemp!"

for /f "usebackq delims=" %%L in ("!gabbyfile!") do (
  set "line=%%L"
  echo !line! | findstr /C:"const messages = [" >nul
  if !errorlevel! equ 0 (
    >>"!gabbytemp!" echo   const messages = [
    >>"!gabbytemp!" echo     { role: 'system', content: SYSTEM_PROMPT },
    >>"!gabbytemp!" echo     ...memory.flatMap(m => [
    >>"!gabbytemp!" echo       { role: 'user', content: m.role === 'user' ? m.content : '' },
    >>"!gabbytemp!" echo       { role: 'assistant', content: m.role !== 'user' ? m.content : '' }
    >>"!gabbytemp!" echo     ]),
    >>"!gabbytemp!" echo     { role: 'user', content: userInput }
  )
  if !errorlevel! neq 0 (
    >>"!gabbytemp!" echo !line!
  )
)
move /Y "!gabbytemp!" "!gabbyfile!" >nul
echo [->] Optimized memory injection in gabby.mjs.

echo [OK] Patch complete.
pause
