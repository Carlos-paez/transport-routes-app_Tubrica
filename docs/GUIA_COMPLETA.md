# 📚 Guía Completa - Sistema TUBRICA

## 🎯 Descripción General

Sistema web interactivo para la gestión y visualización de rutas de transporte público en Venezuela, desarrollado para TUBRICA (Transporte OMEGA). Disponible en dos versiones: JavaScript (Node.js) y PHP.

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado)

**Windows:**
```cmd
scripts\iniciar-docker.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/iniciar-docker.sh
./scripts/iniciar-docker.sh
```

### Opción 2: Instalación Local

#### Versión JavaScript
```bash
cd src/javascript
npm install
node server.js
# http://localhost:3000
```

#### Versión PHP
```bash
cd src/php
php -S localhost:8000
# http://localhost:8000
```

## ✨ Funcionalidades

### Gestión de Rutas OMEGA
- ✅ 10+ rutas predefinidas con colores únicos
- ✅ Mostrar/ocultar rutas individuales o todas
- ✅ Zoom automático a ruta seleccionada
- ✅ Visualización de límites municipales

### Herramientas de Dibujo
- **Trazado Manual**: Dibuja rutas punto por punto
- **Ruta Inteligente**: Genera rutas siguiendo calles reales (OSRM)
- **Ir a TUBRICA**: Crea ruta directa desde cualquier punto a la sede
- **Marcadores**: Añade puntos de interés personalizados
- **Editar**: Modifica rutas arrastrando puntos
- **Borrador**: Elimina segmentos con sensibilidad ajustable
- **Eliminar**: Borra elementos completos

### Exportación y Reportes
- Exportación a PDF de alta calidad (scale: 3)
- Título y fecha automáticos
- Sin distorsión de imagen
- Incluye todas las capas visibles

### Persistencia
- Base de datos SQLite
- Guardado automático de geometrías
- Preservación de colores de rutas
- Botón "Guardar Cambios" para cambios pendientes

## 🗺️ Capas de Mapa

1. **Mapa de Calles**: OpenStreetMap
2. **Satélite**: Esri World Imagery
3. **Vista Híbrida**: Satélite + Etiquetas de calles

## 📊 Comparación de Versiones

| Aspecto | JavaScript (Node.js) | PHP |
|---------|---------------------|-----|
| **Backend** | Express.js | PHP nativo |
| **Puerto** | 3000 | 8000 (configurable) |
| **Instalación** | npm install | Sin dependencias |
| **Hosting** | Requiere Node.js | Apache/Nginx/PHP built-in |
| **Rendimiento** | Excelente | Excelente |
| **Funcionalidades** | 100% | 100% |
| **Recomendado para** | Apps modernas, microservicios | Hosting compartido, servidores tradicionales |

## 🔧 Requisitos Técnicos

### Versión JavaScript
- Node.js >= 14.x
- npm >= 6.x
- SQLite3

### Versión PHP
- PHP >= 7.4
- Extensión PDO SQLite habilitada
- Servidor web (opcional)

### Docker (Ambas)
- Docker >= 20.x
- Docker Compose >= 1.27

## 📡 API REST

### Endpoints JavaScript
```
GET    /api/elements
POST   /api/elements
PUT    /api/elements/:id
DELETE /api/elements/:id
```

### Endpoints PHP
```
GET    api.php
POST   api.php
PUT    api.php?id=X
DELETE api.php?id=X
```

## 🗄️ Estructura de Base de Datos

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

## 🎨 Sistema de Colores

Paleta de 20 colores vibrantes que se asignan secuencialmente:
- Rojo (#e74c3c), Azul (#3498db), Verde (#2ecc71)
- Naranja (#f39c12), Púrpura (#9b59b6), Turquesa (#1abc9c)
- Y 14 colores más...

Cada ruta nueva recibe un color único del ciclo.

## 🐛 Solución de Problemas

### Puerto en Uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Base de Datos Bloqueada
```bash
rm routes.db-shm routes.db-wal
```

### PDO SQLite no Encontrado (PHP)
```bash
# Ubuntu/Debian
sudo apt-get install php-sqlite3

# CentOS/RHEL
sudo yum install php-pdo
```

### Docker: Contenedor no Inicia
```bash
docker-compose down
docker-compose up --build
```

## 🔒 Consideraciones de Seguridad

Para producción:
- ✅ Implementar autenticación de usuarios
- ✅ Usar HTTPS
- ✅ Validar y sanitizar todas las entradas
- ✅ Implementar rate limiting
- ✅ Restringir acceso por IP (opcional)
- ✅ Hacer backups regulares de la base de datos

## 📝 Migración de Datos

Para migrar datos entre versiones:
```bash
cp "src/javascript/routes.db" "src/php/routes.db"
```

Ambas versiones usan la misma estructura de base de datos.

## 🎓 Recursos Adicionales

- [Leaflet.js Documentation](https://leafletjs.com/)
- [OSRM API Documentation](http://project-osrm.org/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

## 📞 Contacto

**Desarrollado para**: TUBRICA - Transporte OMEGA  
**Ubicación**: Venezuela  
**Versión**: 2.0

---

*Última actualización: 2024*
