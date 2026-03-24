# 📁 Estructura del Proyecto - Sistema TUBRICA

## 🎯 Organización General

```
transport-routes-app/
│
├── 📂 src/                          # Código fuente
│   ├── 📂 javascript/               # Versión Node.js
│   │   ├── 📄 app.js               # Lógica frontend (1,035 líneas)
│   │   ├── 📄 server.js            # Servidor Express
│   │   ├── 📄 index.html           # Interfaz HTML
│   │   ├── 📄 styles.css           # Estilos CSS
│   │   ├── 📄 package.json         # Dependencias npm
│   │   ├── 📄 package-lock.json    # Lock de dependencias
│   │   ├── 🐳 Dockerfile           # Imagen Docker
│   │   ├── 🐳 docker-compose.yml   # Orquestación Docker
│   │   ├── 📄 .dockerignore        # Exclusiones Docker
│   │   ├── 🗄️ routes.db            # Base de datos SQLite
│   │   └── 📖 README.md            # Guía específica Node.js
│   │
│   └── 📂 php/                      # Versión PHP
│       ├── 📄 app.js               # Lógica frontend (822 líneas)
│       ├── 📄 api.php              # API REST PHP
│       ├── 📄 index.php            # Interfaz HTML
│       ├── 📄 styles.css           # Estilos CSS
│       ├── 📄 .htaccess            # Configuración Apache
│       ├── 📄 health.php           # Health check endpoint
│       ├── 🐳 Dockerfile           # Imagen Docker
│       ├── 🐳 docker-compose.yml   # Orquestación Docker
│       ├── 📄 .dockerignore        # Exclusiones Docker
│       ├── 🗄️ routes.db            # Base de datos SQLite
│       └── 📖 README.md            # Guía específica PHP
│
├── 📂 docs/                         # Documentación
│   ├── 📖 README.md                # Índice de documentación
│   ├── 📘 GUIA_COMPLETA.md         # Guía principal (completa)
│   ├── 📗 API.md                   # Documentación API REST
│   ├── 📙 DOCKER.md                # Guía Docker completa
│   ├── 📕 DIFERENCIAS_VERSIONES.md # Comparación técnica
│   ├── 📔 RESUMEN_REPARACION.md    # Últimos cambios
│   ├── 📓 HISTORIAL_DESARROLLO.md  # Historia del proyecto
│   ├── 📄 ARQUITECTURA_DOCKER.md   # Arquitectura Docker
│   ├── 📄 COMANDOS_DOCKER.md       # Comandos Docker
│   │
│   └── 📂 legacy/                  # Documentación histórica
│       ├── 📄 ACTUALIZACION_COLORES_PERSISTENTES.md
│       ├── 📄 APLICAR_CAMBIOS_COLORES.txt
│       ├── 📄 CAMBIOS_COLORES.txt
│       ├── 📄 COLORES_RUTAS.md
│       ├── 📄 COLORES_RUTAS.txt
│       ├── 📄 RESUMEN_FINAL_COLORES.txt
│       ├── 📄 RUTAS_OMEGA_COLORES.txt
│       ├── 📄 SOLUCION_PHP.txt
│       ├── 📄 VERIFICACION.txt
│       ├── 📄 INDICE_DOCUMENTACION.txt
│       └── 📄 INICIO_RAPIDO.txt
│
├── 📂 scripts/                      # Scripts de utilidad
│   ├── 🪟 iniciar-docker.bat       # Inicio Docker (Windows)
│   ├── 🐧 iniciar-docker.sh        # Inicio Docker (Linux/Mac)
│   ├── 🪟 diagnostico-php.bat      # Diagnóstico PHP (Windows)
│   └── 🐧 diagnostico-php.sh       # Diagnóstico PHP (Linux/Mac)
│
├── 📂 backups/                      # Backups de base de datos
│   └── 📄 .gitkeep                 # Mantener carpeta en git
│
├── 📄 README.md                     # README principal
├── 📄 ESTRUCTURA_PROYECTO.md        # Este archivo
├── 📄 .gitignore                    # Exclusiones de Git
├── 📄 license.txt                   # Licencia del proyecto
│
└── 📂 .git/                         # Control de versiones Git
```

## 📊 Estadísticas del Proyecto

### Código Fuente
- **JavaScript**: 1,035 líneas
- **PHP**: 822 líneas
- **HTML**: ~100 líneas (ambas versiones)
- **CSS**: ~200 líneas (idéntico)
- **Total**: ~2,157 líneas de código

### Documentación
- **Guías principales**: 7 archivos
- **Documentación legacy**: 11 archivos
- **READMEs específicos**: 3 archivos
- **Total**: 21 archivos de documentación

### Configuración
- **Docker**: 4 archivos (2 Dockerfiles, 2 docker-compose.yml)
- **Scripts**: 4 archivos (.bat y .sh)
- **Configuración**: 2 archivos (.htaccess, .dockerignore)

## 🗂️ Descripción de Carpetas

### `/src/`
Contiene todo el código fuente de ambas versiones. Cada versión es completamente independiente y funcional.

**Subcarpetas**:
- `javascript/` - Versión Node.js + Express
- `php/` - Versión PHP nativa

### `/docs/`
Documentación completa del proyecto, organizada por temas.

**Subcarpetas**:
- `legacy/` - Documentación histórica consolidada

### `/scripts/`
Scripts de utilidad para iniciar, diagnosticar y gestionar el sistema.

**Tipos**:
- `.bat` - Scripts para Windows
- `.sh` - Scripts para Linux/Mac

### `/backups/`
Carpeta para almacenar backups de la base de datos. Inicialmente vacía.

**Uso recomendado**:
```bash
# Crear backup
cp src/javascript/routes.db backups/routes-$(date +%Y%m%d-%H%M%S).db
```

## 📋 Archivos Raíz

### README.md
Punto de entrada principal del proyecto. Contiene:
- Inicio rápido
- Características principales
- Enlaces a documentación
- Información de contacto

### ESTRUCTURA_PROYECTO.md (este archivo)
Mapa completo de la organización del proyecto.

### .gitignore
Exclusiones de Git para:
- node_modules/
- Bases de datos (*.db)
- Archivos temporales
- IDEs
- Logs

### license.txt
Licencia del proyecto.

## 🔄 Flujo de Archivos

### Desarrollo
```
src/[version]/
├── Editar código fuente
├── Probar localmente
└── Commit cambios
```

### Documentación
```
docs/
├── Actualizar guías
├── Agregar ejemplos
└── Revisar referencias
```

### Despliegue
```
scripts/
├── Ejecutar iniciar-docker
├── Verificar contenedores
└── Acceder a aplicación
```

### Backups
```
backups/
├── Crear backup antes de cambios
├── Nombrar con fecha/hora
└── Verificar integridad
```

## 🎯 Archivos Clave por Tarea

### Iniciar el Sistema
1. `README.md` - Inicio rápido
2. `scripts/iniciar-docker.bat` o `.sh` - Ejecución Docker
3. `src/[version]/README.md` - Instalación local

### Desarrollar Funcionalidades
1. `src/[version]/app.js` - Lógica frontend
2. `src/javascript/server.js` o `src/php/api.php` - Backend
3. `docs/API.md` - Referencia de API

### Resolver Problemas
1. `docs/GUIA_COMPLETA.md` - Solución de problemas general
2. `docs/DOCKER.md` - Problemas de Docker
3. `src/[version]/README.md` - Problemas específicos

### Entender el Proyecto
1. `README.md` - Visión general
2. `docs/HISTORIAL_DESARROLLO.md` - Historia completa
3. `docs/DIFERENCIAS_VERSIONES.md` - Comparación técnica

## 🔍 Búsqueda Rápida

### "¿Cómo inicio el proyecto?"
→ `README.md` (sección Inicio Rápido)

### "¿Qué endpoints tiene la API?"
→ `docs/API.md`

### "¿Cómo uso Docker?"
→ `docs/DOCKER.md`

### "¿Qué versión elijo?"
→ `docs/DIFERENCIAS_VERSIONES.md`

### "¿Qué cambió recientemente?"
→ `docs/RESUMEN_REPARACION.md`

### "¿Cómo funciona el sistema de colores?"
→ `docs/HISTORIAL_DESARROLLO.md` (Fase 2)

## 📦 Archivos Ignorados (.gitignore)

### No se suben a Git:
- ✅ node_modules/
- ✅ *.db, *.db-shm, *.db-wal
- ✅ .env, config.local.*
- ✅ Logs (*.log)
- ✅ Archivos temporales

### Sí se suben a Git:
- ✅ Código fuente (*.js, *.php, *.html, *.css)
- ✅ Documentación (*.md, *.txt)
- ✅ Configuración (Dockerfile, docker-compose.yml)
- ✅ Scripts (*.bat, *.sh)

## 🎨 Convenciones de Nombres

### Archivos
- **MAYUSCULAS.md** - Documentación importante
- **minusculas.js** - Código fuente
- **kebab-case.sh** - Scripts
- **.dotfiles** - Configuración

### Carpetas
- **minusculas** - Carpetas de código
- **minusculas** - Carpetas de documentación

## 🔐 Archivos Sensibles

### No Incluir en Git:
- Credenciales de base de datos
- API keys
- Tokens de autenticación
- Configuraciones de producción

### Usar Variables de Entorno:
```bash
# .env (no incluir en git)
DB_PATH=/data/routes.db
API_KEY=tu_api_key_aqui
SECRET_KEY=tu_secret_key
```

## 📈 Mantenimiento

### Limpieza Periódica
```bash
# Eliminar archivos temporales
rm -rf src/*/node_modules
rm -f src/*/*.db-shm src/*/*.db-wal

# Limpiar Docker
docker system prune -a
```

### Backups Recomendados
```bash
# Diario
cp src/javascript/routes.db backups/daily-$(date +%Y%m%d).db

# Semanal
cp src/javascript/routes.db backups/weekly-$(date +%Y-W%V).db

# Mensual
cp src/javascript/routes.db backups/monthly-$(date +%Y-%m).db
```

---

*Esta estructura está diseñada para ser clara, escalable y fácil de mantener.*
