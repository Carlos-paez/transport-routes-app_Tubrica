# 🎨 Sistema de Colores para Rutas - TUBRICA

## Descripción

Se ha implementado un sistema de colores automático que asigna un color diferente a cada ruta trazada, facilitando la distinción visual entre múltiples rutas en el mapa.

## Características

- **20 colores vibrantes** disponibles en la paleta
- **Asignación secuencial**: Cada nueva ruta recibe el siguiente color de la paleta
- **Ciclo automático**: Después de usar los 20 colores, vuelve a empezar
- **Rutas OMEGA**: Mantienen su color naranja característico (#e67e22)

## Paleta de Colores

| Color | Código Hex | Nombre |
|-------|------------|--------|
| 🔴 | #e74c3c | Rojo |
| 🔵 | #3498db | Azul |
| 🟢 | #2ecc71 | Verde |
| 🟠 | #f39c12 | Naranja |
| 🟣 | #9b59b6 | Púrpura |
| 🔷 | #1abc9c | Turquesa |
| 🟠 | #e67e22 | Naranja oscuro |
| ⚫ | #34495e | Gris oscuro |
| 🔷 | #16a085 | Verde azulado |
| 🟢 | #27ae60 | Verde esmeralda |
| 🔵 | #2980b9 | Azul oscuro |
| 🟣 | #8e44ad | Púrpura oscuro |
| 🔴 | #c0392b | Rojo oscuro |
| 🟠 | #d35400 | Naranja quemado |
| 🟡 | #f1c40f | Amarillo |
| 🩷 | #e91e63 | Rosa |
| 🔷 | #00bcd4 | Cian |
| 🟢 | #4caf50 | Verde claro |
| 🟠 | #ff9800 | Naranja brillante |
| 🟤 | #795548 | Marrón |

## Funcionamiento

### Rutas Manuales y Automáticas
Cada vez que se crea una nueva ruta (manual o inteligente), se le asigna automáticamente el siguiente color de la paleta.

### Rutas OMEGA
Las rutas predefinidas de OMEGA mantienen su color naranja característico para diferenciarlas de las rutas creadas por el usuario.

## Archivos Modificados

- `javascript version/app.js`
- `php version/app.js`

## Funciones Agregadas

```javascript
// Obtener el siguiente color en secuencia
getNextRouteColor()

// Obtener un color aleatorio (disponible pero no usado por defecto)
getRandomRouteColor()
```

## Personalización

Si deseas cambiar los colores o agregar más, edita el array `ROUTE_COLORS` en el archivo `app.js`:

```javascript
const ROUTE_COLORS = [
  "#e74c3c", // Rojo
  "#3498db", // Azul
  // ... agrega más colores aquí
];
```

## Notas

- Los colores se asignan en el orden en que se crean las rutas
- El sistema es consistente entre recargas de página
- Cada versión (JavaScript y PHP) tiene su propio contador de colores independiente
