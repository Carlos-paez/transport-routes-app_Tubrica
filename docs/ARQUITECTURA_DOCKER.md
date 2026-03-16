═══════════════════════════════════════════════════════════════════════════════
  ARQUITECTURA DOCKER - SISTEMA TUBRICA
═══════════════════════════════════════════════════════════════════════════════


┌─────────────────────────────────────────────────────────────────────────────┐
│                          SISTEMA TUBRICA                                    │
│                     Gestión Logística de Transporte                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌───────────────────────┐       ┌───────────────────────┐
        │  VERSIÓN JAVASCRIPT   │       │    VERSIÓN PHP        │
        │   (Node.js + Express) │       │  (PHP 8.2 + Apache)   │
        └───────────────────────┘       └───────────────────────┘
                    │                               │
                    ▼                               ▼
        ┌───────────────────────┐       ┌───────────────────────┐
        │  CONTENEDOR DOCKER    │       │  CONTENEDOR DOCKER    │
        │  tubrica-javascript   │       │    tubrica-php        │
        │                       │       │                       │
        │  Puerto: 3000         │       │  Puerto: 8080         │
        │  Imagen: node:18      │       │  Imagen: php:8.2      │
        └───────────────────────┘       └───────────────────────┘
                    │                               │
                    ▼                               ▼
        ┌───────────────────────┐       ┌───────────────────────┐
        │   VOLÚMENES DOCKER    │       │   VOLÚMENES DOCKER    │
        │                       │       │                       │
        │  • routes.db          │       │  • routes.db          │
        │  • routes.db-shm      │       │  • routes.db-shm      │
        │  • routes.db-wal      │       │  • routes.db-wal      │
        └───────────────────────┘       └───────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
  COMPONENTES DE CADA CONTENEDOR
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│ CONTENEDOR JAVASCRIPT (tubrica-javascript)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Sistema Operativo: Alpine Linux                                           │
│  Runtime: Node.js 18                                                        │
│  Framework: Express.js 5.2.1                                                │
│  Base de Datos: SQLite3 5.1.7                                               │
│                                                                             │
│  Estructura Interna:                                                        │
│  /app/                                                                      │
│  ├── server.js          → Servidor Express                                 │
│  ├── app.js             → Lógica del cliente                               │
│  ├── index.html         → Interfaz web                                     │
│  ├── styles.css         → Estilos                                          │
│  ├── routes.db          → Base de datos (volumen)                          │
│  └── node_modules/      → Dependencias                                     │
│                                                                             │
│  Puertos:                                                                   │
│  • 3000:3000 (Host:Contenedor)                                             │
│                                                                             │
│  Características:                                                           │
│  • Reinicio automático (unless-stopped)                                    │
│  • Healthcheck cada 30 segundos                                            │
│  • Modo producción (NODE_ENV=production)                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│ CONTENEDOR PHP (tubrica-php)                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Sistema Operativo: Debian                                                 │
│  Runtime: PHP 8.2                                                           │
│  Servidor Web: Apache 2.4                                                  │
│  Base de Datos: SQLite3                                                    │
│                                                                             │
│  Estructura Interna:                                                        │
│  /var/www/html/                                                             │
│  ├── index.php          → Interfaz web                                     │
│  ├── api.php            → API REST                                         │
│  ├── app.js             → Lógica del cliente                               │
│  ├── styles.css         → Estilos                                          │
│  └── routes.db          → Base de datos (volumen)                          │
│                                                                             │
│  Puertos:                                                                   │
│  • 8080:80 (Host:Contenedor)                                               │
│                                                                             │
│  Características:                                                           │
│  • Reinicio automático (unless-stopped)                                    │
│  • Healthcheck cada 30 segundos                                            │
│  • Apache con mod_rewrite habilitado                                       │
│  • Permisos configurados para www-data                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
  FLUJO DE DATOS
═══════════════════════════════════════════════════════════════════════════════

    Usuario                    Contenedor                  Base de Datos
      │                            │                            │
      │  HTTP Request              │                            │
      ├───────────────────────────>│                            │
      │  (localhost:3000/8080)     │                            │
      │                            │                            │
      │                            │  Query SQL                 │
      │                            ├───────────────────────────>│
      │                            │                            │
      │                            │  Resultado                 │
      │                            │<───────────────────────────┤
      │                            │                            │
      │  HTTP Response             │                            │
      │<───────────────────────────┤                            │
      │  (JSON/HTML)               │                            │
      │                            │                            │


═══════════════════════════════════════════════════════════════════════════════
  PERSISTENCIA DE DATOS
═══════════════════════════════════════════════════════════════════════════════

Los volúmenes de Docker garantizan que los datos persistan incluso cuando
los contenedores se detienen o eliminan:

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Host (Tu computadora)              Contenedor Docker                      │
│                                                                             │
│  src/javascript/                    /app/                                  │
│  ├── routes.db          ←──────────→ routes.db                             │
│  ├── routes.db-shm      ←──────────→ routes.db-shm                         │
│  └── routes.db-wal      ←──────────→ routes.db-wal                         │
│                                                                             │
│  src/php/                           /var/www/html/                         │
│  ├── routes.db          ←──────────→ routes.db                             │
│  ├── routes.db-shm      ←──────────→ routes.db-shm                         │
│  └── routes.db-wal      ←──────────→ routes.db-wal                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Archivos de Base de Datos:
• routes.db     → Base de datos principal SQLite
• routes.db-shm → Shared Memory (optimización de rendimiento)
• routes.db-wal → Write-Ahead Log (transacciones ACID)


═══════════════════════════════════════════════════════════════════════════════
  NETWORKING
═══════════════════════════════════════════════════════════════════════════════

Cada contenedor tiene su propia red aislada:

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                          Red del Host                                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  localhost:3000  ──────────┐                                       │   │
│  │                            │                                       │   │
│  │  localhost:8080  ────────┐ │                                       │   │
│  │                          │ │                                       │   │
│  │                          ▼ ▼                                       │   │
│  │                    ┌──────────┐                                    │   │
│  │                    │  Docker  │                                    │   │
│  │                    │  Engine  │                                    │   │
│  │                    └──────────┘                                    │   │
│  │                          │                                         │   │
│  │         ┌────────────────┴────────────────┐                        │   │
│  │         │                                  │                        │   │
│  │         ▼                                  ▼                        │   │
│  │  ┌─────────────┐                   ┌─────────────┐                 │   │
│  │  │ Container   │                   │ Container   │                 │   │
│  │  │ JavaScript  │                   │    PHP      │                 │   │
│  │  │ (Port 3000) │                   │ (Port 80)   │                 │   │
│  │  └─────────────┘                   └─────────────┘                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
  HEALTHCHECKS
═══════════════════════════════════════════════════════════════════════════════

Ambos contenedores incluyen verificaciones automáticas de salud:

JavaScript:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Comando: wget --quiet --tries=1 --spider http://localhost:3000             │
│ Intervalo: 30 segundos                                                      │
│ Timeout: 10 segundos                                                        │
│ Reintentos: 3                                                               │
│                                                                             │
│ Estados posibles:                                                           │
│ • healthy   → Aplicación funcionando correctamente                         │
│ • unhealthy → Aplicación no responde (se reinicia automáticamente)         │
│ • starting  → Contenedor iniciando                                         │
└─────────────────────────────────────────────────────────────────────────────┘

PHP:
┌─────────────────────────────────────────────────────────────────────────────┐
│ Comando: curl -f http://localhost/index.php                                │
│ Intervalo: 30 segundos                                                      │
│ Timeout: 10 segundos                                                        │
│ Reintentos: 3                                                               │
│                                                                             │
│ Estados posibles:                                                           │
│ • healthy   → Aplicación funcionando correctamente                         │
│ • unhealthy → Aplicación no responde (se reinicia automáticamente)         │
│ • starting  → Contenedor iniciando                                         │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
  CICLO DE VIDA DE LOS CONTENEDORES
═══════════════════════════════════════════════════════════════════════════════

1. BUILD (Construcción)
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ docker-compose build                                                    │
   │                                                                         │
   │ • Lee Dockerfile                                                        │
   │ • Descarga imagen base                                                  │
   │ • Instala dependencias                                                  │
   │ • Copia archivos de la aplicación                                      │
   │ • Crea imagen Docker                                                    │
   └─────────────────────────────────────────────────────────────────────────┘

2. START (Inicio)
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ docker-compose up -d                                                    │
   │                                                                         │
   │ • Crea contenedor desde la imagen                                      │
   │ • Monta volúmenes                                                       │
   │ • Configura red                                                         │
   │ • Expone puertos                                                        │
   │ • Ejecuta comando de inicio                                            │
   │ • Inicia healthchecks                                                   │
   └─────────────────────────────────────────────────────────────────────────┘

3. RUNNING (En ejecución)
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ Estado: Contenedor activo                                               │
   │                                                                         │
   │ • Aplicación sirviendo requests                                        │
   │ • Healthchecks verificando estado                                      │
   │ • Logs siendo generados                                                │
   │ • Base de datos persistiendo cambios                                   │
   └─────────────────────────────────────────────────────────────────────────┘

4. STOP (Detención)
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ docker-compose stop                                                     │
   │                                                                         │
   │ • Envía señal SIGTERM al proceso                                       │
   │ • Espera cierre graceful (10 segundos)                                 │
   │ • Detiene el contenedor                                                │
   │ • Mantiene volúmenes y configuración                                   │
   └─────────────────────────────────────────────────────────────────────────┘

5. REMOVE (Eliminación)
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ docker-compose down                                                     │
   │                                                                         │
   │ • Detiene contenedor                                                   │
   │ • Elimina contenedor                                                   │
   │ • Elimina red                                                          │
   │ • Mantiene volúmenes (datos persisten)                                │
   └─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
  RECURSOS Y LÍMITES
═══════════════════════════════════════════════════════════════════════════════

Recursos utilizados por cada contenedor (aproximados):

JavaScript (Node.js):
┌─────────────────────────────────────────────────────────────────────────────┐
│ CPU: ~5-10% en reposo, hasta 50% bajo carga                                │
│ RAM: ~50-100 MB en reposo, hasta 200 MB bajo carga                         │
│ Disco: ~150 MB (imagen + dependencias)                                     │
│ Red: Variable según tráfico                                                │
└─────────────────────────────────────────────────────────────────────────────┘

PHP (Apache):
┌─────────────────────────────────────────────────────────────────────────────┐
│ CPU: ~5-15% en reposo, hasta 60% bajo carga                                │
│ RAM: ~80-150 MB en reposo, hasta 300 MB bajo carga                         │
│ Disco: ~200 MB (imagen + Apache + PHP)                                     │
│ Red: Variable según tráfico                                                │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
  SEGURIDAD
═══════════════════════════════════════════════════════════════════════════════

Medidas de seguridad implementadas:

✓ Contenedores aislados (cada uno en su propio namespace)
✓ Imágenes oficiales de Docker Hub
✓ Permisos mínimos necesarios
✓ No se ejecuta como root (www-data en PHP)
✓ Volúmenes específicos (no se monta todo el sistema)
✓ Puertos expuestos solo los necesarios
✓ Healthchecks para detectar fallos
✓ Reinicio automático en caso de crash


═══════════════════════════════════════════════════════════════════════════════
  ESCALABILIDAD
═══════════════════════════════════════════════════════════════════════════════

Para escalar horizontalmente (múltiples instancias):

JavaScript:
docker-compose up -d --scale tubrica-js=3

Esto creará 3 instancias del contenedor JavaScript.
Necesitarás un load balancer (nginx, traefik) para distribuir el tráfico.


═══════════════════════════════════════════════════════════════════════════════
  MONITOREO
═══════════════════════════════════════════════════════════════════════════════

Comandos útiles para monitorear:

# Ver uso de recursos en tiempo real
docker stats tubrica-javascript tubrica-php

# Ver logs en tiempo real
docker-compose logs -f

# Ver estado de salud
docker ps --format "table {{.Names}}\t{{.Status}}"

# Inspeccionar contenedor
docker inspect tubrica-javascript


═══════════════════════════════════════════════════════════════════════════════
  FIN DEL DOCUMENTO
═══════════════════════════════════════════════════════════════════════════════
