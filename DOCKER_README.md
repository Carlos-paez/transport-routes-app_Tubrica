# 🐳 Guía Rápida de Docker - TUBRICA

## Inicio Rápido

### Windows
Ejecuta el archivo `iniciar-docker.bat` haciendo doble clic o desde la terminal:
```cmd
iniciar-docker.bat
```

### Linux/Mac
Primero da permisos de ejecución y luego ejecuta:
```bash
chmod +x iniciar-docker.sh
./iniciar-docker.sh
```

## Comandos Manuales Rápidos

### Versión JavaScript

```bash
# Iniciar
cd "javascript version"
docker-compose up -d

# Acceder
http://localhost:3000

# Detener
docker-compose down
```

### Versión PHP

```bash
# Iniciar
cd "php version"
docker-compose up -d

# Acceder
http://localhost:8080

# Detener
docker-compose down
```

## Verificar Estado

```bash
# Ver contenedores en ejecución
docker ps

# Ver logs
docker logs tubrica-javascript
docker logs tubrica-php
```

## Solución Rápida de Problemas

### Puerto ocupado
Si el puerto está en uso, edita `docker-compose.yml` y cambia:
- `"3000:3000"` por `"3001:3000"` (JavaScript)
- `"8080:80"` por `"8081:80"` (PHP)

### Reconstruir después de cambios
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Limpiar todo
```bash
docker-compose down -v
docker system prune -a
```

## Documentación Completa

Para la lista completa de comandos y opciones avanzadas, consulta:
- `COMANDOS_DOCKER.txt` - Guía completa de comandos
- `README.md` - Documentación general del proyecto

## Estructura de Archivos Docker

```
javascript version/
├── Dockerfile              # Configuración de imagen Node.js
├── docker-compose.yml      # Orquestación del contenedor
└── .dockerignore          # Archivos excluidos

php version/
├── Dockerfile              # Configuración de imagen PHP+Apache
├── docker-compose.yml      # Orquestación del contenedor
└── .dockerignore          # Archivos excluidos
```

## Características de los Contenedores

### JavaScript
- Imagen base: `node:18-alpine`
- Puerto: 3000
- Reinicio automático
- Healthcheck incluido
- Volúmenes para persistencia de BD

### PHP
- Imagen base: `php:8.2-apache`
- Puerto: 8080 (mapeado a 80 interno)
- Apache con mod_rewrite
- Reinicio automático
- Healthcheck incluido
- Volúmenes para persistencia de BD

## Persistencia de Datos

Ambas versiones utilizan volúmenes de Docker para persistir la base de datos SQLite:
- `routes.db` - Base de datos principal
- `routes.db-shm` - Shared memory
- `routes.db-wal` - Write-Ahead Log

Los datos se mantienen incluso después de detener los contenedores.
