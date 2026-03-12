# 🚀 Inicio Rápido - Sistema TUBRICA

## ⚡ 3 Pasos para Empezar

### 1️⃣ Elige tu Versión

**¿Tienes Node.js instalado?** → Usa JavaScript  
**¿Tienes PHP instalado?** → Usa PHP  
**¿Tienes Docker?** → Usa cualquiera (recomendado)

### 2️⃣ Inicia el Sistema

#### Con Docker (Más Fácil)

**Windows:**
```cmd
scripts\iniciar-docker.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/iniciar-docker.sh
./scripts/iniciar-docker.sh
```

Selecciona opción 1 (JavaScript) o 2 (PHP) y listo.

#### Sin Docker

**JavaScript:**
```bash
cd src/javascript
npm install
node server.js
```
Abre: http://localhost:3000

**PHP:**
```bash
cd src/php
php -S localhost:8000
```
Abre: http://localhost:8000

### 3️⃣ Usa la Aplicación

1. **Ver Rutas OMEGA**: Ya están cargadas y visibles
2. **Crear Nueva Ruta**: Click en "🛣 Ruta Inteligente" → Click en el mapa
3. **Editar Ruta**: Click en "✏️ Editar Ruta" → Click en una ruta → Arrastra puntos
4. **Guardar**: Click en "💾 Guardar Cambios"
5. **Exportar**: Click en "📄 Exportar PDF"

## 🎯 Herramientas Disponibles

| Herramienta | Descripción | Uso |
|-------------|-------------|-----|
| 📈 Trazado Manual | Dibuja rutas a mano | Click para agregar puntos |
| 🛣 Ruta Inteligente | Ruta automática por calles | Click en puntos, sigue calles |
| 🧭 Ir a TUBRICA | Ruta directa a la sede | Click en origen |
| 📍 Marcador | Punto de interés | Click en ubicación |
| ✏️ Editar Ruta | Modifica rutas | Click en ruta, arrastra puntos |
| 🗑 Eliminar | Borra elementos | Click en elemento |
| 🧹 Borrador | Elimina segmentos | Arrastra sobre la ruta |

## 🗺️ Capas de Mapa

Cambia entre capas usando el control superior derecho:
- **Mapa de Calles**: Vista estándar de OpenStreetMap
- **Satélite**: Imágenes satelitales de Esri
- **Vista Híbrida**: Satélite + nombres de calles

## 💡 Tips Rápidos

### Rutas OMEGA
- ✅ Usa los checkboxes para mostrar/ocultar rutas
- ✅ Click en el nombre para hacer zoom a la ruta
- ✅ Botones "Mostrar/Ocultar" para todas las rutas

### Colores
- ✅ Cada ruta nueva recibe un color único automáticamente
- ✅ Los colores se guardan en la base de datos
- ✅ 20 colores vibrantes disponibles en ciclo

### Edición
- ✅ Arrastra puntos para modificar rutas
- ✅ Los cambios se marcan como "dirty"
- ✅ Click "Guardar Cambios" para persistir

### Borrador
- ✅ Ajusta la sensibilidad con el slider
- ✅ Arrastra sobre segmentos para eliminarlos
- ✅ Los cambios se guardan automáticamente

## 🐛 Problemas Comunes

### "No puedo ver el mapa"
→ Verifica tu conexión a internet (requiere tiles de OpenStreetMap)

### "Puerto en uso"
→ Cambia el puerto en docker-compose.yml o cierra la aplicación que lo usa

### "Base de datos bloqueada"
→ Cierra la aplicación y elimina archivos .db-shm y .db-wal

### "Docker no inicia"
→ Verifica que Docker Desktop esté corriendo

## 📚 Más Información

- **Guía Completa**: `docs/GUIA_COMPLETA.md`
- **API**: `docs/API.md`
- **Docker**: `docs/DOCKER.md`
- **Estructura**: `ESTRUCTURA_PROYECTO.md`

## 🎓 Tutoriales Paso a Paso

### Tutorial 1: Crear tu Primera Ruta

1. Abre la aplicación
2. Click en "🛣 Ruta Inteligente"
3. Click en el punto de inicio en el mapa
4. Click en el punto de destino
5. Click en cualquier marcador naranja para finalizar
6. Ingresa un nombre cuando se solicite
7. ¡Listo! Tu ruta está creada con color único

### Tutorial 2: Editar una Ruta Existente

1. Click en "✏️ Editar Ruta"
2. Click en la ruta que quieres editar
3. Arrastra los puntos blancos para modificar
4. Click en la ruta nuevamente para terminar
5. Click en "💾 Guardar Cambios"

### Tutorial 3: Exportar a PDF

1. Ajusta el zoom y posición del mapa
2. Activa/desactiva las rutas que quieres incluir
3. Selecciona la capa de mapa deseada
4. Click en "📄 Exportar PDF"
5. Espera unos segundos
6. El PDF se descargará automáticamente

## ⚙️ Configuración Rápida

### Cambiar Puerto (JavaScript)
Edita `src/javascript/server.js`:
```javascript
const PORT = 3000; // Cambiar aquí
```

### Cambiar Puerto (PHP)
```bash
php -S localhost:9000  # Usar puerto 9000
```

### Cambiar Puerto (Docker)
Edita `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Puerto externo:interno
```

## 🎯 Casos de Uso Rápidos

### Planificar Ruta Nueva
1. Ruta Inteligente → Click puntos → Nombrar → Guardar

### Modificar Ruta Existente
1. Editar → Click ruta → Arrastra → Guardar

### Generar Reporte
1. Ajustar vista → Exportar PDF → Descargar

### Agregar Punto de Interés
1. Marcador → Click ubicación → Nombrar

## 📞 Ayuda Rápida

**¿No funciona algo?**
1. Revisa `docs/GUIA_COMPLETA.md` (Sección "Solución de Problemas")
2. Consulta el README de tu versión (`src/[version]/README.md`)
3. Revisa los logs si usas Docker

**¿Quieres más funcionalidades?**
1. Lee `docs/HISTORIAL_DESARROLLO.md` (Sección "Futuras Mejoras")
2. Abre un issue en el repositorio
3. Contribuye con un Pull Request

---

**🎉 ¡Listo para empezar! El sistema está 100% funcional.**

*Para más detalles, consulta la documentación completa en `docs/`*
