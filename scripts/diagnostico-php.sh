#!/bin/bash

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

clear
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  DIAGNÓSTICO - VERSIÓN PHP TUBRICA${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

cd "php version"

echo -e "${YELLOW}[1/7] Verificando estado del contenedor...${NC}"
docker ps -a | grep tubrica-php
echo ""

echo -e "${YELLOW}[2/7] Verificando logs recientes...${NC}"
docker logs --tail 20 tubrica-php
echo ""

echo -e "${YELLOW}[3/7] Verificando archivos en el contenedor...${NC}"
docker exec tubrica-php ls -la /var/www/html/
echo ""

echo -e "${YELLOW}[4/7] Verificando permisos de base de datos...${NC}"
docker exec tubrica-php ls -la /var/www/html/routes.db 2>/dev/null || echo "Base de datos no encontrada (se creará al primer uso)"
echo ""

echo -e "${YELLOW}[5/7] Verificando módulos de Apache...${NC}"
docker exec tubrica-php apache2ctl -M | grep -i -E "rewrite|headers"
echo ""

echo -e "${YELLOW}[6/7] Verificando extensiones PHP...${NC}"
docker exec tubrica-php php -m | grep -i -E "pdo|sqlite"
echo ""

echo -e "${YELLOW}[7/7] Probando conectividad...${NC}"
curl -s http://localhost:8080/health.php | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8080/health.php
echo ""
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  DIAGNÓSTICO COMPLETADO${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Prueba estos URLs en tu navegador:${NC}"
echo "  - http://localhost:8080"
echo "  - http://localhost:8080/health.php"
echo "  - http://localhost:8080/test.php"
echo ""

cd ..
