# Diferencias entre Versión JavaScript y PHP

## ✅ Estado Actual
Ambas versiones ahora funcionan **exactamente igual** con todas las funcionalidades implementadas.

## 🔧 Diferencias Técnicas

### Backend

#### Versión JavaScript (Node.js)
- **Servidor**: `server.js` usando Express
- **Puerto**: 3000
- **Base de datos**: SQLite con `sqlite3` npm package
- **Inicio**: `node server.js`

#### Versión PHP
- **Servidor**: `api.php` (REST API)
- **Puerto**: Depende del servidor web (Apache/Nginx/PHP built-in)
- **Base de datos**: SQLite con PDO
- **Inicio**: `php -S localhost:8000` (desde la carpeta php version)

### Frontend
Ambas versiones usan el **mismo código frontend unificado**:
- `app.js` - Lógica de la aplicación (~5,500 líneas, incluye sidebar y leyendas)
- `index.html/index.php` - Estructura HTML con **doble barra lateral** (Herramientas a la izquierda, Leyenda a la derecha)
- `styles.css` - Estilos unificados con soporte para temas y sidebars colapsables

### API Endpoints
Ambos backends han sido sincronizados para soportar campos adicionales como `passengers`.

#### JavaScript (Node.js)
```javascript
GET    /api/elements
POST   /api/elements
PUT    /api/elements/:id
DELETE /api/elements/:id
```

#### PHP
```php
GET    api.php
POST   api.php
PUT    api.php?id=X
DELETE api.php?id=X
```

## 🚀 Cómo Iniciar Cada Versión

### Versión JavaScript
```bash
cd src/javascript
npm install
node server.js
# Abrir: http://localhost:3000
```

### Versión PHP
```bash
cd src/php
php -S localhost:8000
# Abrir: http://localhost:8000
```

O usar Apache/Nginx apuntando a la carpeta `src/php`.

## ✨ Funcionalidades Implementadas (Ambas Versiones)

### Rutas OMEGA
- ✅ Carga automática de rutas predefinidas
- ✅ Colores únicos para cada ruta
- ✅ Mostrar/Ocultar rutas individuales
- ✅ Mostrar/Ocultar todas las rutas
- ✅ Zoom a ruta específica

### Herramientas de Dibujo
- ✅ Trazado Manual
- ✅ Ruta Inteligente (OSRM)
- ✅ Ir a TUBRICA (ruta directa)
- ✅ Marcadores
- ✅ Editar Rutas
- ✅ Eliminar Elementos
- ✅ Borrador Dinámico

### Persistencia
- ✅ Guardar rutas en base de datos
- ✅ Cargar rutas al iniciar
- ✅ Actualizar geometría al editar
- ✅ Guardar colores de rutas
- ✅ Botón "Guardar Cambios"

### Exportación
- ✅ Exportar mapa a PDF
- ✅ Alta definición (scale: 3)
- ✅ Sin distorsión de imagen
- ✅ Título y fecha automáticos

### Interfaz
- ✅ Sidebar colapsable
- ✅ Indicador de modo activo
- ✅ Control de sensibilidad del borrador
- ✅ Capas de mapa (Calles/Satélite/Híbrido)
- ✅ Límites municipales

## 🎨 Colores de Rutas
Ambas versiones usan la misma paleta de 48 colores vibrantes (v2026) que se asignan secuencialmente a cada nueva ruta, garantizando que cada ruta tenga un color único y distintivo.

## 💾 Base de Datos
Estructura idéntica en ambas versiones:
```sql
CREATE TABLE elements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    geometry TEXT,
    color TEXT,
    passengers INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🔄 Migración entre Versiones
Para migrar datos de una versión a otra, simplemente copia el archivo `routes.db` de una carpeta a la otra.

## 📝 Notas
- Ambas versiones son completamente funcionales
- El código frontend es idéntico
- La única diferencia es el backend (Node.js vs PHP)
- Elige la versión según tu infraestructura de servidor
