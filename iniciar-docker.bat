@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════════════
echo   SISTEMA DE GESTIÓN LOGÍSTICA TUBRICA - DOCKER
echo ═══════════════════════════════════════════════════════════════
echo.

:menu
echo Seleccione una opción:
echo.
echo 1. Iniciar versión JavaScript (Puerto 3000)
echo 2. Iniciar versión PHP (Puerto 8080)
echo 3. Iniciar AMBAS versiones
echo 4. Detener versión JavaScript
echo 5. Detener versión PHP
echo 6. Detener AMBAS versiones
echo 7. Ver logs JavaScript
echo 8. Ver logs PHP
echo 9. Reconstruir JavaScript
echo 10. Reconstruir PHP
echo 0. Salir
echo.

set /p opcion="Ingrese el número de opción: "

if "%opcion%"=="1" goto js_start
if "%opcion%"=="2" goto php_start
if "%opcion%"=="3" goto both_start
if "%opcion%"=="4" goto js_stop
if "%opcion%"=="5" goto php_stop
if "%opcion%"=="6" goto both_stop
if "%opcion%"=="7" goto js_logs
if "%opcion%"=="8" goto php_logs
if "%opcion%"=="9" goto js_rebuild
if "%opcion%"=="10" goto php_rebuild
if "%opcion%"=="0" goto end

echo Opción inválida
pause
cls
goto menu

:js_start
echo.
echo Iniciando versión JavaScript...
cd "javascript version"
docker-compose up -d
echo.
echo ✓ Aplicación JavaScript iniciada en http://localhost:3000
cd ..
pause
cls
goto menu

:php_start
echo.
echo Iniciando versión PHP...
cd "php version"
docker-compose up -d
echo.
echo ✓ Aplicación PHP iniciada en http://localhost:8080
cd ..
pause
cls
goto menu

:both_start
echo.
echo Iniciando ambas versiones...
cd "javascript version"
docker-compose up -d
cd ..
cd "php version"
docker-compose up -d
cd ..
echo.
echo ✓ JavaScript: http://localhost:3000
echo ✓ PHP: http://localhost:8080
pause
cls
goto menu

:js_stop
echo.
echo Deteniendo versión JavaScript...
cd "javascript version"
docker-compose down
cd ..
echo ✓ Versión JavaScript detenida
pause
cls
goto menu

:php_stop
echo.
echo Deteniendo versión PHP...
cd "php version"
docker-compose down
cd ..
echo ✓ Versión PHP detenida
pause
cls
goto menu

:both_stop
echo.
echo Deteniendo ambas versiones...
cd "javascript version"
docker-compose down
cd ..
cd "php version"
docker-compose down
cd ..
echo ✓ Ambas versiones detenidas
pause
cls
goto menu

:js_logs
echo.
echo Mostrando logs de JavaScript (Ctrl+C para salir)...
cd "javascript version"
docker-compose logs -f
cd ..
pause
cls
goto menu

:php_logs
echo.
echo Mostrando logs de PHP (Ctrl+C para salir)...
cd "php version"
docker-compose logs -f
cd ..
pause
cls
goto menu

:js_rebuild
echo.
echo Reconstruyendo versión JavaScript...
cd "javascript version"
docker-compose down
docker-compose build --no-cache
docker-compose up -d
cd ..
echo ✓ JavaScript reconstruido e iniciado
pause
cls
goto menu

:php_rebuild
echo.
echo Reconstruyendo versión PHP...
cd "php version"
docker-compose down
docker-compose build --no-cache
docker-compose up -d
cd ..
echo ✓ PHP reconstruido e iniciado
pause
cls
goto menu

:end
echo.
echo Gracias por usar el sistema TUBRICA
echo.
exit
