@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════════════
echo   DIAGNÓSTICO - VERSIÓN PHP TUBRICA
echo ═══════════════════════════════════════════════════════════════
echo.

cd "php version"

echo [1/7] Verificando estado del contenedor...
docker ps -a | findstr tubrica-php
echo.

echo [2/7] Verificando logs recientes...
docker logs --tail 20 tubrica-php
echo.

echo [3/7] Verificando archivos en el contenedor...
docker exec tubrica-php ls -la /var/www/html/
echo.

echo [4/7] Verificando permisos de base de datos...
docker exec tubrica-php ls -la /var/www/html/routes.db
echo.

echo [5/7] Verificando módulos de Apache...
docker exec tubrica-php apache2ctl -M | findstr -i "rewrite headers"
echo.

echo [6/7] Verificando extensiones PHP...
docker exec tubrica-php php -m | findstr -i "pdo sqlite"
echo.

echo [7/7] Probando conectividad...
curl -s http://localhost:8080/health.php
echo.
echo.

echo ═══════════════════════════════════════════════════════════════
echo   DIAGNÓSTICO COMPLETADO
echo ═══════════════════════════════════════════════════════════════
echo.
echo Prueba estos URLs en tu navegador:
echo   - http://localhost:8080
echo   - http://localhost:8080/health.php
echo   - http://localhost:8080/test.php
echo.

cd ..
pause
