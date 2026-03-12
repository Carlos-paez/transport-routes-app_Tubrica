# 🚌 Sistema de Gestión Logística - TUBRICA

Sistema web interactivo para la gestión y visualización de rutas de transporte público en Venezuela, desarrollado para TUBRICA (Transporte OMEGA).

## 🚀 Inicio Rápido con Docker

¿Primera vez usando el proyecto? Lee `INICIO_RAPIDO.txt` o ejecuta:

**Windows:** `iniciar-docker.bat`  
**Linux/Mac:** `./iniciar-docker.sh`

## 📋 Descripción

Aplicación de mapeo interactivo que permite crear, editar y gestionar rutas de transporte público sobre mapas de OpenStreetMap. Incluye herramientas de trazado manual, enrutamiento inteligente, marcadores personalizados y exportación a PDF.

## ✨ Características

- 🗺️ Visualización interactiva de mapas con Leaflet.js
- ✏️ Trazado manual de rutas de transporte
- 🛣️ Enrutamiento inteligente automático
- 🎨 Colores automáticos diferentes para cada ruta (20 colores vibrantes)
- 🚌 Rutas OMEGA predefinidas con colores únicos para cada una
- 📍 Colocación de marcadores y puntos de interés
- 🧹 Herramienta de borrador con sensibilidad ajustable
- 💾 Persistencia de datos con SQLite
- 📄 Exportación de mapas a PDF
- 🎨 Interfaz responsive y moderna

## 🚀 Versiones Disponibles

El proyecto incluye dos implementaciones:

### JavaScript (Node.js + Express)
Backend completo en Node.js con Express y SQLite.

### PHP
Implementación alternativa con backend en PHP.

## 📦 Requisitos Previos

### Versión JavaScript
- Node.js >= 14.x
- npm >= 6.x

### Versión PHP
- PHP >= 7.4
- SQLite3 extension habilitada
- Servidor web (Apache/Nginx) o PHP built-in server

## 🔧 Instalación

### Versión JavaScript

```bash
cd "javascript version"
npm install
```

### Versión PHP

```bash
cd "php version"
npm install  # Solo para dependencias frontend si las hay
```

## ▶️ Ejecución

### Versión JavaScript

```bash
cd "javascript version"
node server.js
```

El servidor estará disponible en `http://localhost:3000`

### Versión PHP

```bash
cd "php version"
php -S localhost:8000
```

El servidor estará disponible en `http://localhost:8000`

## 🐳 Docker (Ambas Versiones)

Ambas versiones incluyen soporte completo para Docker con contenedores independientes.

### Inicio Rápido con Scripts

**Windows:**
```cmd
iniciar-docker.bat
```

**Linux/Mac:**
```bash
chmod +x iniciar-docker.sh
./iniciar-docker.sh
```

### Comandos Manuales

**Versión JavaScript:**
```bash
cd "javascript version"
docker-compose up -d
```
Acceder en: `http://localhost:3000`

**Versión PHP:**
```bash
cd "php version"
docker-compose up -d
```
Acceder en: `http://localhost:8080`

### Ejecutar Ambas Simultáneamente

```bash
# Terminal 1
cd "javascript version" && docker-compose up -d

# Terminal 2
cd "php version" && docker-compose up -d
```

### Documentación Docker

- `DOCKER_README.md` - Guía rápida de Docker
- `COMANDOS_DOCKER.txt` - Lista completa de comandos y solución de problemas
- `iniciar-docker.bat` - Script interactivo para Windows
- `iniciar-docker.sh` - Script interactivo para Linux/Mac

## 📚 Estructura del Proyecto

```
.
├── javascript version/
│   ├── server.js          # Servidor Express
│   ├── app.js             # Lógica frontend
│   ├── index.html         # Interfaz principal
│   ├── styles.css         # Estilos
│   ├── routes.db          # Base de datos SQLite
│   └── package.json       # Dependencias Node.js
│
├── php version/
│   ├── api.php            # API REST en PHP
│   ├── index.php          # Interfaz principal
│   ├── app.js             # Lógica frontend
│   ├── styles.css         # Estilos
│   ├── routes.db          # Base de datos SQLite
│   └── docker-compose.yml # Configuración Docker
│
└── README.md
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- Leaflet.js - Mapas interactivos
- Leaflet.draw - Herramientas de dibujo
- HTML2Canvas - Captura de pantalla
- jsPDF - Generación de PDFs

### Backend

**JavaScript:**
- Node.js
- Express.js
- SQLite3
- CORS

**PHP:**
- PHP 7.4+
- SQLite3
- Docker (opcional)

## 📖 Uso

1. **Visualizar Rutas**: Las rutas guardadas se cargan automáticamente al iniciar
2. **Trazado Manual**: Haz clic en "Trazado Manual" y dibuja sobre el mapa
3. **Ruta Inteligente**: Activa "Ruta Inteligente" para enrutamiento automático entre puntos
4. **Marcadores**: Coloca marcadores en ubicaciones específicas
5. **Editar**: Selecciona "Editar Ruta" y modifica rutas existentes
6. **Eliminar**: Usa la herramienta "Eliminar" o el "Borrador" para remover elementos
7. **Guardar**: Presiona "Guardar Cambios" para persistir las modificaciones
8. **Exportar**: Genera un PDF del mapa actual con "Exportar PDF"

## 🔌 API Endpoints

### JavaScript Version

```
GET    /api/elements      # Obtener todos los elementos
POST   /api/elements      # Crear nuevo elemento
PUT    /api/elements/:id  # Actualizar elemento
DELETE /api/elements/:id  # Eliminar elemento
```

### PHP Version

```
GET    /api.php?action=get       # Obtener todos los elementos
POST   /api.php?action=create    # Crear nuevo elemento
PUT    /api.php?action=update    # Actualizar elemento
DELETE /api.php?action=delete    # Eliminar elemento
```

## 🗃️ Base de Datos

El sistema utiliza SQLite con la siguiente estructura:

```sql
CREATE TABLE elements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    geometry TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia especificada en el archivo `license.txt`.

## 👥 Autor

Desarrollado para TUBRICA - Transporte OMEGA

## 🐛 Reporte de Problemas

Si encuentras algún bug o tienes sugerencias, por favor abre un issue en el repositorio.

### Problema Común: Versión PHP no accesible

Si la versión PHP no carga en el navegador después de iniciar Docker, consulta el archivo `SOLUCION_PHP.txt` para pasos detallados de solución.

## 📞 Soporte

Para soporte técnico o consultas, contacta al equipo de desarrollo de TUBRICA.

---

**Nota**: Este sistema está diseñado específicamente para la gestión de rutas de transporte público en Venezuela.
