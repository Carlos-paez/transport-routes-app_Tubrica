# Rutas Omega Persistentes - Versión PHP

## Cambios Implementados

Se ha modificado la versión PHP para que las rutas Omega sean completamente editables y persistentes.

## Funcionalidad Nueva

### 1. Persistencia de Ediciones
- Las rutas Omega ahora se guardan en la base de datos cuando se editan
- Los cambios se mantienen después de recargar la página
- Se preserva el color asignado a cada ruta

### 2. Carga Inteligente
Al cargar la aplicación:
- **Primera vez**: Se generan las rutas desde las coordenadas originales usando OSRM y se guardan en BD
- **Siguientes cargas**: Se cargan las versiones editadas desde la base de datos
- Ya no se regeneran desde coordenadas en bruto si existe una versión guardada

### 3. Guardado de Cambios
- El botón "💾 Guardar Cambios" ahora guarda tanto rutas normales como rutas Omega
- El borrador también guarda automáticamente los cambios en rutas Omega
- Se puede editar cualquier ruta Omega con la herramienta "✏️ Editar Ruta"

## Flujo de Trabajo

1. **Primera Carga**:
   - Las rutas Omega se generan desde `OMEGA_WAYPOINTS`
   - Se consulta OSRM para obtener la ruta optimizada
   - Se guarda automáticamente en la base de datos

2. **Edición**:
   - Activar modo "✏️ Editar Ruta"
   - Hacer clic en una ruta Omega
   - Arrastrar los puntos para modificar el trazado
   - Hacer clic nuevamente para finalizar edición
   - Presionar "💾 Guardar Cambios"

3. **Recargas Posteriores**:
   - Se carga la versión editada desde la base de datos
   - No se regenera desde coordenadas originales
   - Se mantiene el color y trazado personalizado

## Identificación de Rutas Omega

Las rutas Omega se identifican por su nombre que contiene:
- `(Admin)` - Rutas administrativas
- `(Rot)` - Rutas rotativas

Ejemplos:
- "OESTE (Admin)"
- "PAVIA (Rot)"
- "CABUDARE A (Admin)"

## Base de Datos

Las rutas Omega se almacenan en la tabla `elements` con:
- `name`: Nombre de la ruta (ej: "OESTE (Admin)")
- `type`: "route"
- `geometry`: Coordenadas editadas en formato JSON
- `color`: Color asignado a la ruta
- `id`: ID único para actualizaciones

## Ventajas

✅ Las ediciones son permanentes
✅ No se pierden cambios al recargar
✅ Mejor rendimiento (no regenera rutas ya guardadas)
✅ Colores consistentes entre sesiones
✅ Permite personalización completa de rutas Omega
