// ==========================================
// CONFIGURACIÓN BASE Y MAPA
// ==========================================
const TUBRICA_LOCATION = L.latLng(10.09673945749423, -69.35846137671071);

const map = L.map("map", {
  preferCanvas: true,
  doubleClickZoom: false,
  zoomControl: false,
}).setView(TUBRICA_LOCATION, 13);

L.control.zoom({ position: "bottomright" }).addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

// CAPAS SEPARADAS
const boundaryLayer = L.layerGroup().addTo(map); // Para municipios (fijo)
const drawnItems = L.featureGroup().addTo(map); // Para rutas (editable)

let currentMode = null;
let smartRoutePoints = [];
let tempPointsMarkers = [];
let previewRouteLine = null;
let eraserCircle = null;
let eraserSize = 30;

L.marker(TUBRICA_LOCATION, { interactive: false })
  .addTo(map)
  .bindPopup("📍 SEDE TUBRICA")
  .openPopup();

// ==========================================
// 🗺️ DELIMITACIÓN DE MUNICIPIOS (IRIBARREN, PALAVECINO, AYACUCHO)
// ==========================================
async function cargarDelimitaciones() {
  const zonas = [
    { name: "Municipio Iribarren", id: 2211603, color: "#3498db" },
    { name: "Municipio Palavecino", id: 2211604, color: "#2ecc71" },
    { name: "Parroquia Ayacucho", id: 7293700, color: "#e74c3c" },
  ];

  zonas.forEach((zona) => {
    // Obtenemos los polígonos de OSM vía Nominatim
    const url = `https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=${zona.id}&class=boundary&addressdetails=1&hierarchy=0&group_hierarchy=1&format=json&polygon_geojson=1`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.geometry) {
          const polygon = L.geoJSON(data.geometry, {
            interactive: false, // Importante: no interfiere con clics
            style: {
              color: zona.color,
              weight: 2,
              opacity: 0.5,
              fillColor: zona.color,
              fillOpacity: 0.03,
              dashArray: "5, 10",
            },
          }).addTo(boundaryLayer);

          // Etiqueta flotante en el centro
          const center = polygon.getBounds().getCenter();
          L.marker(center, {
            icon: L.divIcon({
              className: "label-municipio",
              html: zona.name,
              iconSize: [150, 20],
            }),
            interactive: false,
          }).addTo(boundaryLayer);
        }
      })
      .catch((e) => console.error("Error cargando límites:", zona.name));
  });
}
cargarDelimitaciones();

// ==========================================
// 🔄 CARGA DE DATOS (HÍBRIDO GO / NODE.JS)
// ==========================================
async function loadData() {
  try {
    const res = await fetch("/api/elements");
    const elements = await res.json();
    elements.forEach((el) => {
      let geo;
      try {
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
    console.error("Error DB:", e);
  }
}
loadData();

// ==========================================
// 🏷️ RENDERIZADO DE RUTAS
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

  let totalMeters = 0;
  let segmentDistances = [];
  for (let i = 1; i < latlngs.length; i++) {
    let d = map.distance(latlngs[i - 1], latlngs[i]);
    segmentDistances.push(d);
    totalMeters += d;
  }
  const distKM = (totalMeters / 1000).toFixed(1);
  let timeText = durationSeconds
    ? formatTime(durationSeconds)
    : formatTime(totalMeters / 11.11);

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

  const label = L.marker(midPos, {
    interactive: false,
    icon: L.divIcon({
      className: "route-label",
      html: `<div class="route-text"><span class="route-name">${name}</span><span class="route-stats">${distKM}km | ${timeText}</span></div>`,
      iconSize: null,
    }),
  });

  const group = L.layerGroup([polyline, label, startPoint, endPoint]);
  group.dbId = id;
  group.type = "route";
  group.routeLine = polyline;

  [polyline, startPoint, endPoint].forEach((layer) => {
    layer.on("click", (e) => {
      if (currentMode === "delete") {
        L.DomEvent.stopPropagation(e);
        handleDelete(group);
      }
    });
  });

  group.addTo(drawnItems);
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
// 🧹 BORRADOR (Solo afecta a drawnItems)
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
// 🛣️ RUTA INTELIGENTE
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
      const duration = data.routes[0].duration;
      const name = prompt("Nombre de la ruta:");
      if (name) {
        const id = await saveElement(name, "route", fullCoords);
        renderRoute(fullCoords, name, id, duration);
      }
    }
  } catch (e) {
    alert("Error OSRM");
  }
  resetModes();
}

map.on("click", async function (e) {
  if (currentMode === "marker") {
    const text = prompt("Nombre:");
    if (text) {
      const id = await saveElement(text, "marker", e.latlng);
      renderMarker(e.latlng, text, id);
    }
  }
  if (currentMode === "smart") {
    smartRoutePoints.push(e.latlng);
    const m = L.circleMarker(e.latlng, {
      radius: 7,
      color: "#e67e22",
      fillColor: "white",
      fillOpacity: 1,
    }).addTo(map);
    m.on("click", (ev) => {
      L.DomEvent.stopPropagation(ev);
      if (smartRoutePoints.length >= 2) fetchOSRM(smartRoutePoints);
    });
    tempPointsMarkers.push(m);
    if (smartRoutePoints.length >= 2) updatePreviewLine();
  }
  if (currentMode === "to-tubrica") fetchOSRM([e.latlng, TUBRICA_LOCATION]);
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
      }).addTo(map);
    }
  } catch (e) {}
}

// ==========================================
// 🛠️ UTILIDADES
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
  if (!drawnItems.hasLayer(layer)) return; // No borrar municipios
  if (confirm("¿Eliminar elemento?")) {
    await fetch(`/api/elements/${layer.dbId}`, { method: "DELETE" });
    drawnItems.removeLayer(layer);
  }
}

const manualDrawer = new L.Draw.Polyline(map, {
  shapeOptions: { color: "#3498db", weight: 6 },
});
function enableManualDraw() {
  resetModes();
  currentMode = "manual";
  manualDrawer.enable();
}
map.on(L.Draw.Event.CREATED, (e) => {
  const name = prompt("Nombre:");
  if (name)
    saveElement(name, "route", e.layer.getLatLngs()).then((id) =>
      renderRoute(e.layer.getLatLngs(), name, id),
    );
});

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
  setStatus("Eliminar");
}
function toggleGoToTubrica() {
  resetModes();
  currentMode = "to-tubrica";
  setStatus("Hacia Tubrica");
}

document.getElementById("eraserSlider").oninput = (e) => {
  eraserSize = parseInt(e.target.value);
  if (eraserCircle) eraserCircle.setRadius(eraserSize);
};

function exportMapToPDF() {
  html2canvas(document.getElementById("map"), { useCORS: true, scale: 2 }).then(
    (canvas) => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 297, 210);
      pdf.save("mapa_tubrica_lara.pdf");
    },
  );
}
