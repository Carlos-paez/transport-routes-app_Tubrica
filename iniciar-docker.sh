#!/bin/bash

# Colores para la terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

clear

mostrar_menu() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  SISTEMA DE GESTIÓN LOGÍSTICA TUBRICA - DOCKER${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Seleccione una opción:"
    echo ""
    echo "1.  Iniciar versión JavaScript (Puerto 3000)"
    echo "2.  Iniciar versión PHP (Puerto 8080)"
    echo "3.  Iniciar AMBAS versiones"
    echo "4.  Detener versión JavaScript"
    echo "5.  Detener versión PHP"
    echo "6.  Detener AMBAS versiones"
    echo "7.  Ver logs JavaScript"
    echo "8.  Ver logs PHP"
    echo "9.  Reconstruir JavaScript"
    echo "10. Reconstruir PHP"
    echo "11. Estado de contenedores"
    echo "0.  Salir"
    echo ""
}

js_start() {
    echo -e "${YELLOW}Iniciando versión JavaScript...${NC}"
    cd "javascript version"
    docker-compose up -d
    cd ..
    echo -e "${GREEN}✓ Aplicación JavaScript iniciada en http://localhost:3000${NC}"
    read -p "Presione Enter para continuar..."
}

php_start() {
    echo -e "${YELLOW}Iniciando versión PHP...${NC}"
    cd "php version"
    docker-compose up -d
    cd ..
    echo -e "${GREEN}✓ Aplicación PHP iniciada en http://localhost:8080${NC}"
    read -p "Presione Enter para continuar..."
}

both_start() {
    echo -e "${YELLOW}Iniciando ambas versiones...${NC}"
    cd "javascript version"
    docker-compose up -d
    cd ..
    cd "php version"
    docker-compose up -d
    cd ..
    echo -e "${GREEN}✓ JavaScript: http://localhost:3000${NC}"
    echo -e "${GREEN}✓ PHP: http://localhost:8080${NC}"
    read -p "Presione Enter para continuar..."
}

js_stop() {
    echo -e "${YELLOW}Deteniendo versión JavaScript...${NC}"
    cd "javascript version"
    docker-compose down
    cd ..
    echo -e "${GREEN}✓ Versión JavaScript detenida${NC}"
    read -p "Presione Enter para continuar..."
}

php_stop() {
    echo -e "${YELLOW}Deteniendo versión PHP...${NC}"
    cd "php version"
    docker-compose down
    cd ..
    echo -e "${GREEN}✓ Versión PHP detenida${NC}"
    read -p "Presione Enter para continuar..."
}

both_stop() {
    echo -e "${YELLOW}Deteniendo ambas versiones...${NC}"
    cd "javascript version"
    docker-compose down
    cd ..
    cd "php version"
    docker-compose down
    cd ..
    echo -e "${GREEN}✓ Ambas versiones detenidas${NC}"
    read -p "Presione Enter para continuar..."
}

js_logs() {
    echo -e "${YELLOW}Mostrando logs de JavaScript (Ctrl+C para salir)...${NC}"
    cd "javascript version"
    docker-compose logs -f
    cd ..
    read -p "Presione Enter para continuar..."
}

php_logs() {
    echo -e "${YELLOW}Mostrando logs de PHP (Ctrl+C para salir)...${NC}"
    cd "php version"
    docker-compose logs -f
    cd ..
    read -p "Presione Enter para continuar..."
}

js_rebuild() {
    echo -e "${YELLOW}Reconstruyendo versión JavaScript...${NC}"
    cd "javascript version"
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    cd ..
    echo -e "${GREEN}✓ JavaScript reconstruido e iniciado${NC}"
    read -p "Presione Enter para continuar..."
}

php_rebuild() {
    echo -e "${YELLOW}Reconstruyendo versión PHP...${NC}"
    cd "php version"
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    cd ..
    echo -e "${GREEN}✓ PHP reconstruido e iniciado${NC}"
    read -p "Presione Enter para continuar..."
}

show_status() {
    echo -e "${YELLOW}Estado de contenedores:${NC}"
    docker ps -a | grep tubrica
    echo ""
    read -p "Presione Enter para continuar..."
}

# Loop principal
while true; do
    clear
    mostrar_menu
    read -p "Ingrese el número de opción: " opcion
    
    case $opcion in
        1) js_start ;;
        2) php_start ;;
        3) both_start ;;
        4) js_stop ;;
        5) php_stop ;;
        6) both_stop ;;
        7) js_logs ;;
        8) php_logs ;;
        9) js_rebuild ;;
        10) php_rebuild ;;
        11) show_status ;;
        0) 
            echo -e "${GREEN}Gracias por usar el sistema TUBRICA${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Opción inválida${NC}"
            read -p "Presione Enter para continuar..."
            ;;
    esac
done
