@echo off
echo 🛑 Force stopping any stuck Node.js processes...
taskkill /F /IM node.exe /T 2>nul

echo 🧹 Cleaning Next.js cache (.next folder)...
if exist .next rmdir /s /q .next

echo 🔄 Regenerating Database Client...
call npx prisma generate

echo 🏗️ Building for production...
npm run build
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build Successful!
) else (
    echo ❌ Build Failed!
)
pause
