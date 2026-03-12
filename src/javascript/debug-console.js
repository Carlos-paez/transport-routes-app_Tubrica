// ==========================================
// SCRIPT DE DIAGNÓSTICO PARA CONSOLA
// ==========================================
// Copiar y pegar en la consola del navegador (F12)

console.log("=== DIAGNÓSTICO DE HERRAMIENTAS TUBRICA ===");

// 1. Verificar que las funciones existen
console.log("\n1. VERIFICACIÓN DE FUNCIONES:");
const functions = [
  'enableManualDraw',
  'toggleSmartRoute',
  'toggleGoToTubrica',
  'enableMarker',
  'enableEditMode',
  'enableDelete',
  'toggleEraser',
  'saveAllChanges',
  'toggleSidebar'
];

functions.forEach(fn => {
  const exists = typeof window[fn] === 'function';
  console.log(`${exists ? '✓' : '✗'} ${fn}: ${exists ? 'OK' : 'NO ENCONTRADA'}`);
});

// 2. Verificar variables globales
console.log("\n2. VARIABLES GLOBALES:");
console.log("map:", typeof map, map ? "OK" : "ERROR");
console.log("currentMode:", currentMode);
console.log("drawnItems:", typeof drawnItems);
console.log("omegaLayer:", typeof omegaLayer);
console.log("smartRoutePoints:", smartRoutePoints);

// 3. Verificar event listeners
console.log("\n3. EVENT LISTENERS:");
console.log("Map click listeners:", map._events?.click?.length || 0);

// 4. Test de activación de modo
console.log("\n4. TEST DE ACTIVACIÓN:");
console.log("Modo actual antes:", currentMode);

// Test rápido (comentar si no quieres que se active)
// window.enableMarker();
// console.log("Modo actual después de enableMarker():", currentMode);

// 5. Instrucciones
console.log("\n5. INSTRUCCIONES DE PRUEBA:");
console.log("Ejecuta: window.enableMarker()");
console.log("Luego verifica: currentMode");
console.log("Debe mostrar: 'marker'");
console.log("\nSi currentMode es 'marker', haz click en el mapa");
console.log("Debe aparecer un prompt pidiendo el nombre");

console.log("\n=== FIN DEL DIAGNÓSTICO ===");
console.log("Para probar manualmente, ejecuta:");
console.log("  window.enableMarker()");
console.log("  console.log('currentMode:', currentMode)");
