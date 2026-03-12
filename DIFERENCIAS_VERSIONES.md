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
Ambas versiones usan el **mismo código frontend**:
- `app.js` - Lógica de la aplicación
- `index.html/index.php` - Estructura HTML (idénticas)
- `styles.css` - Estilos (idénticos)

### API Endpoints

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
cd "javascript version"
npm install
node server.js
# Abrir: http://localhost:3000
```

### Versión PHP
```bash
cd "php version"
php -S localhost:8000
# Abrir: http://localhost:8000
```

O usar Apache/Nginx apuntando a la carpeta `php version`.

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
Ambas versiones usan la misma paleta de 20 colores vibrantes que se asignan secuencialmente a cada nueva ruta, garantizando que cada ruta tenga un color único y distintivo.

## 💾 Base de Datos
Estructura idéntica en ambas versiones:
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

## 🔄 Migración entre Versiones
Para migrar datos de una versión a otra, simplemente copia el archivo `routes.db` de una carpeta a la otra.

## 📝 Notas
- Ambas versiones son completamente funcionales
- El código frontend es idéntico
- La única diferencia es el backend (Node.js vs PHP)
- Elige la versión según tu infraestructura de servidor
