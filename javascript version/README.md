# Versión JavaScript (Node.js) - TUBRICA

## 🚀 Inicio Rápido

### Requisitos
- Node.js (v14 o superior)
- npm

### Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor
node server.js
```

El servidor se iniciará en: **http://localhost:3000**

## 📦 Dependencias

- **express**: Framework web para Node.js
- **sqlite3**: Base de datos SQLite
- **body-parser**: Middleware para parsear JSON
- **cors**: Middleware para CORS

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

### Puerto
Por defecto usa el puerto 3000. Para cambiarlo, edita `server.js`:

```javascript
const PORT = 3000; // Cambiar aquí
```

## 📡 API Endpoints

- `GET /api/elements` - Obtener todos los elementos
- `POST /api/elements` - Crear nuevo elemento
- `PUT /api/elements/:id` - Actualizar elemento
- `DELETE /api/elements/:id` - Eliminar elemento

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

### Error: Puerto en uso
Si el puerto 3000 está ocupado:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: sqlite3 no se instala
```bash
npm rebuild sqlite3
```

## 📝 Notas

- Los datos se guardan automáticamente en `routes.db`
- El archivo de base de datos es portable entre versiones
- Para resetear la base de datos, simplemente elimina `routes.db`
