@echo off
echo ==========================================
echo    INICIANDO PETLOCAL - AMBIENTE LOCAL
echo ==========================================
echo 1/2 Gerando Cliente Prisma...
call npx prisma generate
echo.
echo 2/2 Iniciando Servidor de Desenvolvimento...
echo.
npm run dev
pause
