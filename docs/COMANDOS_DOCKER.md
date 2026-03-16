═══════════════════════════════════════════════════════════════════════════════
  COMANDOS DOCKER - SISTEMA DE GESTIÓN LOGÍSTICA TUBRICA
═══════════════════════════════════════════════════════════════════════════════

Este archivo contiene todos los comandos necesarios para construir, ejecutar
y gestionar las aplicaciones en contenedores Docker.

═══════════════════════════════════════════════════════════════════════════════
  REQUISITOS PREVIOS
═══════════════════════════════════════════════════════════════════════════════

1. Tener Docker instalado y en ejecución
   - Verificar instalación: docker --version
   - Verificar Docker Compose: docker-compose --version

2. Puertos disponibles:
   - Puerto 3000 para versión JavaScript
   - Puerto 8080 para versión PHP


═══════════════════════════════════════════════════════════════════════════════
  VERSIÓN JAVASCRIPT (Node.js + Express)
═══════════════════════════════════════════════════════════════════════════════

--- CONSTRUCCIÓN DE LA IMAGEN ---

cd src/javascript
docker-compose build


--- INICIAR EL CONTENEDOR ---

# Iniciar en modo detached (segundo plano)
docker-compose up -d

# Iniciar en modo interactivo (ver logs en tiempo real)
docker-compose up


--- ACCEDER A LA APLICACIÓN ---

Abrir navegador en: http://localhost:3000


--- VERIFICAR ESTADO DEL CONTENEDOR ---

docker-compose ps
docker logs tubrica-javascript


--- VER LOGS EN TIEMPO REAL ---

docker-compose logs -f


--- DETENER EL CONTENEDOR ---

docker-compose stop


--- DETENER Y ELIMINAR EL CONTENEDOR ---

docker-compose down


--- REINICIAR EL CONTENEDOR ---

docker-compose restart


--- RECONSTRUIR Y REINICIAR (después de cambios en código) ---

docker-compose down
docker-compose build --no-cache
docker-compose up -d


--- EJECUTAR COMANDOS DENTRO DEL CONTENEDOR ---

# Acceder a la terminal del contenedor
docker exec -it tubrica-javascript sh

# Ejecutar comando específico
docker exec tubrica-javascript node --version


--- LIMPIAR TODO (contenedor, imagen y volúmenes) ---

docker-compose down -v
docker rmi tubrica-javascript


═══════════════════════════════════════════════════════════════════════════════
  VERSIÓN PHP (PHP + Apache)
═══════════════════════════════════════════════════════════════════════════════

--- CONSTRUCCIÓN DE LA IMAGEN ---

cd src/php
docker-compose build


--- INICIAR EL CONTENEDOR ---

# Iniciar en modo detached (segundo plano)
docker-compose up -d

# Iniciar en modo interactivo (ver logs en tiempo real)
docker-compose up


--- ACCEDER A LA APLICACIÓN ---

Abrir navegador en: http://localhost:8080


--- VERIFICAR ESTADO DEL CONTENEDOR ---

docker-compose ps
docker logs tubrica-php


--- VER LOGS EN TIEMPO REAL ---

docker-compose logs -f


--- DETENER EL CONTENEDOR ---

docker-compose stop


--- DETENER Y ELIMINAR EL CONTENEDOR ---

docker-compose down


--- REINICIAR EL CONTENEDOR ---

docker-compose restart


--- RECONSTRUIR Y REINICIAR (después de cambios en código) ---

docker-compose down
docker-compose build --no-cache
docker-compose up -d


--- EJECUTAR COMANDOS DENTRO DEL CONTENEDOR ---

# Acceder a la terminal del contenedor
docker exec -it tubrica-php bash

# Verificar versión de PHP
docker exec tubrica-php php --version

# Ver logs de Apache
docker exec tubrica-php tail -f /var/log/apache2/error.log


--- LIMPIAR TODO (contenedor, imagen y volúmenes) ---

docker-compose down -v
docker rmi tubrica-php


═══════════════════════════════════════════════════════════════════════════════
  EJECUTAR AMBAS VERSIONES SIMULTÁNEAMENTE
═══════════════════════════════════════════════════════════════════════════════

--- INICIAR AMBAS APLICACIONES ---

# Terminal 1 - Versión JavaScript
cd src/javascript
docker-compose up -d

# Terminal 2 - Versión PHP
cd src/php
docker-compose up -d


--- VERIFICAR AMBOS CONTENEDORES ---

docker ps


--- ACCEDER A LAS APLICACIONES ---

Versión JavaScript: http://localhost:3000
Versión PHP:        http://localhost:8080


--- DETENER AMBAS APLICACIONES ---

# Terminal 1
cd src/javascript
docker-compose down

# Terminal 2
cd src/php
docker-compose down


═══════════════════════════════════════════════════════════════════════════════
  COMANDOS ÚTILES DE DOCKER
═══════════════════════════════════════════════════════════════════════════════

--- LISTAR CONTENEDORES ---

# Contenedores en ejecución
docker ps

# Todos los contenedores (incluyendo detenidos)
docker ps -a


--- LISTAR IMÁGENES ---

docker images


--- ELIMINAR CONTENEDORES DETENIDOS ---

docker container prune


--- ELIMINAR IMÁGENES NO UTILIZADAS ---

docker image prune


--- ELIMINAR TODO (contenedores, imágenes, volúmenes, redes) ---

docker system prune -a --volumes


--- VER USO DE RECURSOS ---

docker stats


--- INSPECCIONAR CONTENEDOR ---

docker inspect tubrica-javascript
docker inspect tubrica-php


--- COPIAR ARCHIVOS DESDE/HACIA CONTENEDOR ---

# Desde contenedor a host
docker cp tubrica-javascript:/app/routes.db ./backup-routes.db

# Desde host a contenedor
docker cp ./archivo.txt tubrica-javascript:/app/


═══════════════════════════════════════════════════════════════════════════════
  SOLUCIÓN DE PROBLEMAS
═══════════════════════════════════════════════════════════════════════════════

--- PROBLEMA: Puerto ya en uso ---

# Verificar qué proceso usa el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :8080

# Cambiar el puerto en docker-compose.yml
# Ejemplo: "3001:3000" en lugar de "3000:3000"


--- PROBLEMA: Contenedor no inicia ---

# Ver logs detallados
docker-compose logs

# Reconstruir sin caché
docker-compose build --no-cache


--- PROBLEMA: Base de datos no persiste ---

# Verificar volúmenes
docker volume ls

# Crear backup de la base de datos
docker cp tubrica-javascript:/app/routes.db ./backup-routes.db


--- PROBLEMA: Cambios en código no se reflejan ---

# Reconstruir imagen
docker-compose down
docker-compose build --no-cache
docker-compose up -d


--- PROBLEMA: Permisos de base de datos (PHP) ---

# Dar permisos al directorio
docker exec tubrica-php chmod 777 /var/www/html/


═══════════════════════════════════════════════════════════════════════════════
  FLUJO DE TRABAJO RECOMENDADO
═══════════════════════════════════════════════════════════════════════════════

1. DESARROLLO INICIAL:
   cd src/javascript  (o src/php)
   docker-compose build
   docker-compose up

2. DESARROLLO CONTINUO:
   - Hacer cambios en el código
   - docker-compose restart (para cambios menores)
   - docker-compose down && docker-compose up (para cambios mayores)

3. PRODUCCIÓN:
   docker-compose build --no-cache
   docker-compose up -d
   docker-compose logs -f

4. MANTENIMIENTO:
   - Backup de base de datos regularmente
   - Monitorear logs: docker-compose logs -f
   - Verificar salud: docker-compose ps


═══════════════════════════════════════════════════════════════════════════════
  NOTAS IMPORTANTES
═══════════════════════════════════════════════════════════════════════════════

• La base de datos SQLite se persiste mediante volúmenes de Docker
• Los contenedores se reinician automáticamente si fallan (restart: unless-stopped)
• Cada versión corre en un contenedor independiente y aislado
• Los puertos pueden cambiarse en docker-compose.yml si hay conflictos
• Para Windows, revisar las rutas: cd src/javascript
• Los healthchecks verifican automáticamente que las aplicaciones estén funcionando


═══════════════════════════════════════════════════════════════════════════════
  COMANDOS RÁPIDOS (COPIAR Y PEGAR)
═══════════════════════════════════════════════════════════════════════════════

# JavaScript - Inicio rápido
cd src/javascript && docker-compose up -d && docker-compose logs -f

# PHP - Inicio rápido
cd src/php && docker-compose up -d && docker-compose logs -f

# Detener todo
docker stop tubrica-javascript tubrica-php

# Eliminar todo
docker rm tubrica-javascript tubrica-php && docker rmi tubrica-javascript tubrica-php


═══════════════════════════════════════════════════════════════════════════════
  FIN DEL DOCUMENTO
═══════════════════════════════════════════════════════════════════════════════
