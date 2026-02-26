// ==========================================
// CONFIGURACIÓN BASE Y MAPA
// ==========================================
const TUBRICA_LOCATION = L.latLng(10.09673945749423, -69.35846137671071);

// preferCanvas: true para que el mapa vuele incluso con miles de puntos
const map = L.map("map", {
  preferCanvas: true,
  doubleClickZoom: false,
  zoomControl: false,
}).setView(TUBRICA_LOCATION, 13);

// Control de zoom en la esquina inferior derecha para no estorbar
L.control.zoom({ position: "bottomright" }).addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

// Grupo principal para persistencia y gestión de capas
const drawnItems = L.featureGroup().addTo(map);

// Variables de Estado
let currentMode = null;
let smartRoutePoints = [];
let tempPointsMarkers = [];
let previewRouteLine = null;
let eraserCircle = null;
let eraserSize = 30;

// Marcador Fijo Sede TUBRICA (No interactivo para no borrarlo por error)
L.marker(TUBRICA_LOCATION, { interactive: false })
  .addTo(map)
  .bindPopup("📍 SEDE TUBRICA")
  .openPopup();

// ==========================================
// 🔄 CARGA DE DATOS (COMPATIBLE GO / NODE.JS)
// ==========================================
async function loadData() {
  try {
    const res = await fetch("/api/elements");
    const elements = await res.json();

    elements.forEach((el) => {
      let geo;
      try {
        // Si viene de Node es String, si viene de Go es Objeto
        geo =
          typeof el.geometry === "string"
            ? JSON.parse(el.geometry)
            : el.geometry;
      } catch (e) {
        geo = el.geometry;
      }

      if (el.type === "route") renderRoute(geo, el.name, el.id);
      else renderMarker(geo, el.name, el.id);
    });
    setTimeout(() => map.invalidateSize(), 200);
  } catch (e) {
    console.error("Error cargando DB:", e);
  }
}
loadData();

// ==========================================
// 🏷️ RENDERIZADO (LÍNEA + PUNTOS + ETIQUETA COMPACTA)
// ==========================================
function renderRoute(latlngs, name, id, durationSeconds = null) {
  if (!latlngs || latlngs.length < 2) return;

  const polyline = L.polyline(latlngs, {
    color: "#3498db",
    weight: 6,
    smoothFactor: 1.5,
  });
  const startPoint = L.circleMarker(latlngs[0], {
    radius: 5,
    color: "#2ecc71",
    fillColor: "white",
    fillOpacity: 1,
  });
  const endPoint = L.circleMarker(latlngs[latlngs.length - 1], {
    radius: 5,
    color: "#e74c3c",
    fillColor: "white",
    fillOpacity: 1,
  });

  // Cálculo de Distancia Real (Metros a Kilómetros)
  let totalMeters = 0;
  let segmentDistances = [];
  for (let i = 1; i < latlngs.length; i++) {
    let d = map.distance(latlngs[i - 1], latlngs[i]);
    segmentDistances.push(d);
    totalMeters += d;
  }
  const distKM = (totalMeters / 1000).toFixed(1);

  // Cálculo de Tiempo (OSRM o Estimado a 40km/h para carga)
  let timeText = durationSeconds
    ? formatTime(durationSeconds)
    : formatTime(totalMeters / 11.11);

  // Punto Medio para la etiqueta
  let halfDist = totalMeters / 2;
  let accumulated = 0;
  let midPos = latlngs[Math.floor(latlngs.length / 2)];
  for (let i = 0; i < segmentDistances.length; i++) {
    accumulated += segmentDistances[i];
    if (accumulated >= halfDist) {
      midPos = latlngs[i + 1];
      break;
    }
  }

  // Diseño Compacto solicitado para PDF
  const label = L.marker(midPos, {
    interactive: false,
    icon: L.divIcon({
      className: "route-label",
      html: `
                <div class="route-text">
                    <span class="route-name">${name}</span>
                    <span class="route-stats">${distKM}km | ${timeText}</span>
                </div>`,
      iconSize: null,
    }),
  });

  const group = L.layerGroup([polyline, label, startPoint, endPoint]);
  group.dbId = id;
  group.type = "route";
  group.routeLine = polyline;

  // Vincular clic para borrar el grupo entero (incluyendo puntos)
  [polyline, startPoint, endPoint].forEach((layer) => {
    layer.on("click", (e) => {
      if (currentMode === "delete") {
        L.DomEvent.stopPropagation(e);
        handleDelete(group);
      }
    });
  });

  group.addTo(drawnItems);
  return group;
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} min`;
}

function renderMarker(latlng, name, id) {
  const marker = L.marker(latlng).bindPopup(`<b>${name}</b>`);
  marker.dbId = id;
  marker.on("click", (e) => {
    if (currentMode === "delete") {
      L.DomEvent.stopPropagation(e);
      handleDelete(marker);
    }
  });
  marker.addTo(drawnItems);
}

// ==========================================
// 🧹 BORRADOR DE PRECISIÓN (MOVIMIENTO)
// ==========================================
function toggleEraser() {
  if (currentMode === "eraser") return resetModes();
  resetModes();
  currentMode = "eraser";
  setStatus("Borrador Activo");
  eraserCircle = L.circle([0, 0], {
    radius: eraserSize,
    color: "red",
    fillOpacity: 0.2,
    interactive: false,
  }).addTo(map);
  map.getContainer().style.cursor = "crosshair";
}

map.on("mousemove", function (e) {
  if (currentMode !== "eraser" || !eraserCircle) return;
  eraserCircle.setLatLng(e.latlng);

  drawnItems.eachLayer((group) => {
    if (group.type !== "route") return;
    const line = group.routeLine;
    const pts = line.getLatLngs();
    const filtered = pts.filter((p) => map.distance(p, e.latlng) > eraserSize);

    if (filtered.length !== pts.length) {
      if (filtered.length < 2) group.toDelete = true;
      else {
        line.setLatLngs(filtered);
        group.isDirty = true;
      }
    }
  });
});

// Sincronizar cambios del borrador al soltar clic
map.on("mouseup", async () => {
  if (currentMode !== "eraser") return;
  drawnItems.eachLayer(async (group) => {
    if (group.toDelete) {
      await fetch(`/api/elements/${group.dbId}`, { method: "DELETE" });
      drawnItems.removeLayer(group);
    } else if (group.isDirty) {
      await fetch(`/api/elements/${group.dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geometry: group.routeLine.getLatLngs() }),
      });
      group.isDirty = false;
    }
  });
});

// ==========================================
// 🛣️ RUTA INTELIGENTE / IR A TUBRICA (OSRM)
// ==========================================
async function fetchOSRM(points) {
  const coordsStr = points.map((p) => `${p.lng},${p.lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const fullCoords = data.routes[0].geometry.coordinates.map((c) => [
        c[1],
        c[0],
      ]);
      const duration = data.routes[0].duration; // Tiempo real de OSRM

      const name = prompt("Ingrese el nombre de la ruta:");
      if (name) {
        const id = await saveElement(name, "route", fullCoords);
        renderRoute(fullCoords, name, id, duration);
      }
    }
  } catch (e) {
    alert("Error al conectar con OSRM");
  }
  resetModes();
}

map.on("click", async function (e) {
  if (currentMode === "marker") {
    const text = prompt("Nombre del punto:");
    if (text) {
      const id = await saveElement(text, "marker", e.latlng);
      renderMarker(e.latlng, text, id);
    }
  }
  if (currentMode === "smart") {
    smartRoutePoints.push(e.latlng);
    // Marcador naranja guía
    const m = L.circleMarker(e.latlng, {
      radius: 7,
      color: "#e67e22",
      fillColor: "white",
      fillOpacity: 1,
      interactive: true,
    }).addTo(map);

    // Finalizar al clicar el último punto naranja
    m.on("click", (ev) => {
      L.DomEvent.stopPropagation(ev);
      if (smartRoutePoints.length >= 2) fetchOSRM(smartRoutePoints);
    });

    tempPointsMarkers.push(m);
    if (smartRoutePoints.length >= 2) updatePreviewLine();
  }
  if (currentMode === "to-tubrica") {
    // Herramienta "Ir a Tubrica": Origen (clic) -> Destino (HQ)
    fetchOSRM([e.latlng, TUBRICA_LOCATION]);
  }
});

async function updatePreviewLine() {
  const coords = smartRoutePoints.map((p) => `${p.lng},${p.lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const pts = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
      if (previewRouteLine) map.removeLayer(previewRouteLine);
      previewRouteLine = L.polyline(pts, {
        color: "#e67e22",
        weight: 4,
        dashArray: "5, 10",
        interactive: false,
      }).addTo(map);
    }
  } catch (e) {}
}

// ==========================================
// 🛠️ UTILIDADES Y GESTIÓN
// ==========================================
function resetModes() {
  currentMode = null;
  smartRoutePoints = [];
  tempPointsMarkers.forEach((m) => map.removeLayer(m));
  tempPointsMarkers = [];
  if (previewRouteLine) {
    map.removeLayer(previewRouteLine);
    previewRouteLine = null;
  }
  if (eraserCircle) {
    map.removeLayer(eraserCircle);
    eraserCircle = null;
  }
  map.getContainer().style.cursor = "";
  setStatus("Inactivo");
}

function setStatus(text) {
  document.getElementById("status").innerText = "Modo: " + text;
}

async function saveElement(name, type, geometry) {
  const res = await fetch("/api/elements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, type, geometry }),
  });
  const d = await res.json();
  return d.id;
}

async function handleDelete(layer) {
  if (confirm("¿Eliminar permanentemente este elemento y sus datos?")) {
    await fetch(`/api/elements/${layer.dbId}`, { method: "DELETE" });
    drawnItems.removeLayer(layer);
  }
}

// Trazado Manual
const manualDrawer = new L.Draw.Polyline(map, {
  shapeOptions: { color: "#3498db", weight: 6 },
});
function enableManualDraw() {
  resetModes();
  currentMode = "manual";
  manualDrawer.enable();
  setStatus("Trazado Manual");
}
map.on(L.Draw.Event.CREATED, (e) => {
  const name = prompt("Nombre de la ruta:");
  if (name) {
    const pts = e.layer.getLatLngs();
    saveElement(name, "route", pts).then((id) => renderRoute(pts, name, id));
  }
});

// Interfaz Sidebar
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
  setTimeout(() => map.invalidateSize(), 350);
}

function enableMarker() {
  resetModes();
  currentMode = "marker";
  setStatus("Marcador");
}
function enableDelete() {
  resetModes();
  currentMode = "delete";
  setStatus("Eliminar elemento");
}
function toggleGoToTubrica() {
  resetModes();
  currentMode = "to-tubrica";
  setStatus("Ruta hacia Tubrica");
}

document.getElementById("eraserSlider").oninput = (e) => {
  eraserSize = parseInt(e.target.value);
  if (eraserCircle) eraserCircle.setRadius(eraserSize);
};

// Exportar PDF
function exportMapToPDF() {
  const btn = document.querySelector(".btn-pdf");
  btn.innerText = "⏳...";
  html2canvas(document.getElementById("map"), { useCORS: true, scale: 2 }).then(
    (canvas) => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 297, 210);
      pdf.save("mapa_rutas_tubrica.pdf");
      btn.innerText = "📄 Exportar PDF";
    },
  );
}
