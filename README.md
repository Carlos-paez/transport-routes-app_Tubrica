# 🚌 Sistema de Gestión de Transporte - TUBRICA

Sistema web interactivo para la gestión y visualización de rutas de transporte público en Venezuela. Disponible en dos versiones: **JavaScript (Node.js)** y **PHP**.

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

#### JavaScript (Node.js)
```bash
cd src/javascript
npm install
node server.js
# Abrir: http://localhost:3000
```

#### PHP
```bash
cd src/php
php -S localhost:8000
# Abrir: http://localhost:8000
```

## ✨ Características Principales

- 🗺️ **Mapas Interactivos**: Visualización con Leaflet.js
- 🎨 **Colores Únicos**: Paleta ampliada de 40+ colores vibrantes
- 🚌 **Rutas OMEGA**: 17 rutas predefinidas con conteo de pasajeros
- 📋 **Leyenda Dinámica**: Nuevo panel lateral derecho con info detallada (Distancia, Tiempo, Pasajeros)
- ✏️ **Trazado Manual**: Dibuja rutas personalizadas
- 🛣️ **Rutas Inteligentes**: Enrutamiento automático con OSRM
- 📍 **Marcadores**: Puntos de interés personalizados con capa independiente
- 🧹 **Borrador Dinámico**: Edición precisa de rutas
- 💾 **Persistencia**: Base de datos SQLite sincronizada
- 📄 **Exportación PDF**: Reportes de alta definición (escala 3x)

##  Estructura del Proyecto

```
transport-routes-app/
├── src/
│   ├── javascript/          # Versión Node.js
│   │   ├── app.js          # Lógica frontend
│   │   ├── server.js       # Servidor Express
│   │   ├── index.html      # Interfaz
│   │   ├── styles.css      # Estilos
│   │   ├── package.json    # Dependencias
│   │   ├── Dockerfile      # Imagen Docker
│   │   └── README.md       # Guía específica
│   │
│   └── php/                # Versión PHP
│       ├── app.js          # Lógica frontend
│       ├── api.php         # API REST
│       ├── index.php       # Interfaz
│       ├── styles.css      # Estilos
│       ├── .htaccess       # Configuración Apache
│       ├── health.php      # Health check
│       ├── Dockerfile      # Imagen Docker
│       └── README.md       # Guía específica
│
├── docs/                   # Documentación
│   ├── GUIA_COMPLETA.md   # Guía principal
│   ├── API.md             # Documentación API
│   ├── DOCKER.md          # Guía Docker
│   ├── DIFERENCIAS_VERSIONES.md
│   ├── RESUMEN_REPARACION.md
│   ├── HISTORIAL_DESARROLLO.md
│   └── legacy/            # Documentación histórica
│
├── scripts/               # Scripts de utilidad
│   ├── iniciar-docker.bat # Inicio Windows
│   ├── iniciar-docker.sh  # Inicio Linux/Mac
│   ├── diagnostico-php.bat
│   └── diagnostico-php.sh
│
├── backups/              # Backups de base de datos
├── .gitignore
├── license.txt
└── README.md            # Este archivo
```

## 📊 Comparación de Versiones

| Característica | JavaScript | PHP |
|---------------|-----------|-----|
| **Backend** | Express.js | PHP nativo |
| **Puerto** | 3000 | 8000 |
| **Instalación** | npm install | Sin dependencias |
| **Hosting** | Node.js | Apache/Nginx/PHP |
| **Funcionalidades** | 100% | 100% |
| **Rendimiento** | ⚡ Excelente | ⚡ Excelente |

**Ambas versiones son idénticas en funcionalidad** - elige según tu infraestructura.

## 🛠️ Tecnologías

### Frontend (Ambas Versiones)
- Leaflet.js - Mapas interactivos
- Leaflet.Draw - Herramientas de dibujo
- OSRM - Enrutamiento inteligente
- html2canvas - Captura de pantalla
- jsPDF - Generación de PDF

### Backend
- **JavaScript**: Express.js + SQLite3
- **PHP**: PHP 7.4+ + PDO SQLite

## 📚 Documentación

- **[Guía Completa](docs/GUIA_COMPLETA.md)** - Documentación principal
- **[API](docs/API.md)** - Endpoints y ejemplos
- **[Docker](docs/DOCKER.md)** - Guía de contenedores
- **[Diferencias](docs/DIFERENCIAS_VERSIONES.md)** - Comparación técnica
- **[Historial](docs/HISTORIAL_DESARROLLO.md)** - Evolución del proyecto

## 🎯 Casos de Uso

- ✅ Planificación de rutas de transporte público
- ✅ Gestión de flotas vehiculares
- ✅ Análisis de cobertura territorial
- ✅ Reportes logísticos
- ✅ Optimización de recorridos

## � Requisitos

### JavaScript
- Node.js >= 14.x
- npm >= 6.x

### PHP
- PHP >= 7.4
- Extensión PDO SQLite

### Docker (Opcional)
- Docker >= 20.x
- Docker Compose >= 1.27

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
rm src/javascript/routes.db-shm
rm src/javascript/routes.db-wal
```

### Más Soluciones
Consulta la documentación específica en `docs/` o los README de cada versión.

## 🔒 Seguridad

Para producción:
- ✅ Implementar autenticación
- ✅ Usar HTTPS
- ✅ Validar entradas
- ✅ Rate limiting
- ✅ Backups regulares

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

Ver [license.txt](license.txt)

## 👥 Créditos

**Desarrollado para**: TUBRICA - Transporte OMEGA  
**Ubicación**: Venezuela  
**Versión**: 2.0

## � Soporte

Para soporte técnico o consultas, consulta la documentación en `docs/` o abre un issue.

---

**🎉 Ambas versiones están 100% funcionales y listas para producción**

*Última actualización: Marzo 2026*
