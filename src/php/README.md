# Versión PHP - TUBRICA

## 🚀 Inicio Rápido

### Requisitos
- PHP 7.4 o superior
- Extensión PDO SQLite habilitada

### Opción 1: Servidor PHP Integrado (Desarrollo)

```bash
# Desde la carpeta "src/php"
php -S localhost:8000
```

El servidor se iniciará en: **http://localhost:8000**

### Opción 2: Apache/Nginx (Producción)

#### Apache
1. Copia la carpeta `src/php` a tu directorio web (ej: `htdocs`, `www`)
2. Asegúrate de que `.htaccess` esté presente
3. Accede a: `http://localhost/php/`

#### Nginx
Configuración básica:
```nginx
server {
    listen 80;
    server_name localhost;
    root /path/to/src/php;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }
}
```

## 🗄️ Base de Datos

La aplicación crea automáticamente un archivo `routes.db` en SQLite con la siguiente estructura:

```sql
CREATE TABLE elements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    geometry TEXT,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🔧 Configuración

### Verificar Extensiones PHP

```bash
php -m | grep -i pdo
php -m | grep -i sqlite
```

Si no están habilitadas, edita `php.ini`:
```ini
extension=pdo_sqlite
extension=sqlite3
```

### Permisos (Linux/Mac)

```bash
chmod 755 .
chmod 666 routes.db  # Si ya existe
```

## 📡 API Endpoints

Todos los endpoints usan `api.php`:

- `GET api.php` - Obtener todos los elementos
- `POST api.php` - Crear nuevo elemento
- `PUT api.php?id=X` - Actualizar elemento
- `DELETE api.php?id=X` - Eliminar elemento

## ✨ Funcionalidades

- ✅ Rutas OMEGA predefinidas con colores únicos
- ✅ Trazado manual de rutas
- ✅ Rutas inteligentes con OSRM
- ✅ Marcadores personalizados
- ✅ Edición de rutas existentes
- ✅ Borrador dinámico
- ✅ Exportación a PDF de alta calidad
- ✅ Persistencia en SQLite
- ✅ Capas de mapa (Calles/Satélite/Híbrido)

## 🐛 Solución de Problemas

### Error: PDO SQLite no encontrado
```bash
# Ubuntu/Debian
sudo apt-get install php-sqlite3

# CentOS/RHEL
sudo yum install php-pdo

# macOS (Homebrew)
brew install php
```

### Error: No se puede escribir en routes.db
```bash
# Linux/Mac
chmod 666 routes.db
chmod 755 .

# Windows: Dar permisos de escritura a la carpeta
```

### Error: Headers already sent
Asegúrate de que `api.php` no tenga espacios o BOM antes de `<?php`

### Error 404 en api.php
Verifica que el archivo `.htaccess` esté presente y que `mod_rewrite` esté habilitado en Apache.

## 📝 Notas

- Los datos se guardan automáticamente en `routes.db`
- El archivo de base de datos es portable entre versiones
- Para resetear la base de datos, simplemente elimina `routes.db`
- En producción, considera usar HTTPS para mayor seguridad

## 🔒 Seguridad

Para producción, considera:
- Limitar acceso a `api.php` por IP
- Implementar autenticación
- Usar HTTPS
- Validar y sanitizar todas las entradas
- Implementar rate limiting
