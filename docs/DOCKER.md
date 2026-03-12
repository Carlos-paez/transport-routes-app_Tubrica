# 🐳 Guía Docker - Sistema TUBRICA

## 🎯 Descripción

Ambas versiones (JavaScript y PHP) incluyen soporte completo para Docker con contenedores independientes y optimizados.

## 🚀 Inicio Rápido

### Scripts Automatizados

**Windows:**
```cmd
scripts\iniciar-docker.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/iniciar-docker.sh
./scripts/iniciar-docker.sh
```

Los scripts te permiten:
1. Elegir qué versión iniciar (JavaScript, PHP o ambas)
2. Ver el estado de los contenedores
3. Detener contenedores
4. Ver logs en tiempo real

## 📦 Configuración Docker

### Versión JavaScript

**Puerto**: 3000  
**Imagen Base**: node:18-alpine  
**Volúmenes**: 
- `./routes.db` → Base de datos persistente
- `./app.js`, `./index.html`, `./styles.css` → Código fuente

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./routes.db:/app/routes.db
```

### Versión PHP

**Puerto**: 8080  
**Imagen Base**: php:8.1-apache  
**Extensiones**: pdo_sqlite  
**Volúmenes**: 
- `./routes.db` → Base de datos persistente
- Todo el código fuente

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:80"
    volumes:
      - ./routes.db:/var/www/html/routes.db
```

## 🔧 Comandos Básicos

### Iniciar Contenedores

```bash
# JavaScript
cd src/javascript
docker-compose up -d

# PHP
cd src/php
docker-compose up -d

# Ambas simultáneamente
docker-compose -f src/javascript/docker-compose.yml up -d
docker-compose -f src/php/docker-compose.yml up -d
```

### Detener Contenedores

```bash
# JavaScript
cd src/javascript
docker-compose down

# PHP
cd src/php
docker-compose down

# Todas
docker-compose down --remove-orphans
```

### Ver Logs

```bash
# JavaScript
cd src/javascript
docker-compose logs -f

# PHP
cd src/php
docker-compose logs -f
```

### Reconstruir Contenedores

```bash
# Después de cambios en Dockerfile
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🔍 Verificación de Estado

### Verificar Contenedores Activos
```bash
docker ps
```

### Verificar Salud del Contenedor
```bash
# JavaScript
curl http://localhost:3000

# PHP
curl http://localhost:8080
curl http://localhost:8080/health.php
```

### Acceder al Contenedor
```bash
# JavaScript
docker exec -it <container_id> sh

# PHP
docker exec -it <container_id> bash
```

## 🗄️ Persistencia de Datos

### Ubicación de Base de Datos

- **JavaScript**: `src/javascript/routes.db`
- **PHP**: `src/php/routes.db`

### Backup de Base de Datos

```bash
# Crear backup
cp src/javascript/routes.db backups/routes-$(date +%Y%m%d).db

# Restaurar backup
cp backups/routes-20240312.db src/javascript/routes.db
```

### Migrar Datos entre Versiones

```bash
# De JavaScript a PHP
cp src/javascript/routes.db src/php/routes.db

# De PHP a JavaScript
cp src/php/routes.db src/javascript/routes.db
```

## 🐛 Solución de Problemas

### Puerto ya en Uso

```bash
# Ver qué está usando el puerto
netstat -ano | findstr :3000  # Windows
lsof -ti:3000                 # Linux/Mac

# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar 3001 en lugar de 3000
```

### Contenedor no Inicia

```bash
# Ver logs detallados
docker-compose logs

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Base de Datos Bloqueada

```bash
# Detener contenedor
docker-compose down

# Eliminar archivos de bloqueo
rm routes.db-shm routes.db-wal

# Reiniciar
docker-compose up -d
```

### Error de Permisos (Linux/Mac)

```bash
# Dar permisos a la base de datos
chmod 666 routes.db
chmod 755 .
```

### Limpiar Todo Docker

```bash
# Eliminar contenedores, imágenes y volúmenes
docker-compose down -v
docker system prune -a
```

## 🔄 Actualización de Código

### Sin Reconstruir Imagen

Los volúmenes permiten actualizar código sin reconstruir:

```bash
# Edita los archivos localmente
# Reinicia el contenedor
docker-compose restart
```

### Con Reconstrucción

Para cambios en `Dockerfile` o dependencias:

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

## 📊 Monitoreo

### Ver Uso de Recursos

```bash
docker stats
```

### Ver Logs en Tiempo Real

```bash
docker-compose logs -f --tail=100
```

## 🌐 Acceso desde Red Local

Para acceder desde otros dispositivos en la red:

1. Encuentra tu IP local:
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

2. Accede desde otro dispositivo:
```
http://<TU_IP>:3000  # JavaScript
http://<TU_IP>:8080  # PHP
```

## 🔐 Seguridad en Producción

### Variables de Entorno

Crea archivo `.env`:
```env
NODE_ENV=production
DB_PATH=/data/routes.db
PORT=3000
```

### HTTPS con Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl;
    server_name tubrica.example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📝 Mejores Prácticas

1. **Backups Regulares**: Automatiza backups de `routes.db`
2. **Logs**: Monitorea logs regularmente
3. **Actualizaciones**: Mantén imágenes Docker actualizadas
4. **Recursos**: Limita recursos del contenedor en producción
5. **Seguridad**: Usa HTTPS y autenticación en producción

## 🎓 Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

*Para más información, consulta los archivos en la carpeta `docs/`*
