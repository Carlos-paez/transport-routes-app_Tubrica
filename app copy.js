// ==========================================
// 1. CONFIGURACIÓN BASE Y MAPA
// ==========================================
const TUBRICA_LOCATION = L.latLng(10.09673945749423, -69.35846137671071);

// preferCanvas: false para permitir interacción con vértices de edición
const map = L.map("map", {
  preferCanvas: false,
  doubleClickZoom: false,
  zoomControl: false,
}).setView(TUBRICA_LOCATION, 12);

L.control.zoom({ position: "bottomright" }).addTo(map);

// crossOrigin: true para que html2canvas pueda capturar el mapa
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  crossOrigin: true,
}).addTo(map);

const boundaryLayer = L.layerGroup().addTo(map);
const drawnItems = L.featureGroup().addTo(map);

let currentMode = null;
let smartRoutePoints = [];
let tempMarkers = [];
let previewLine = null;
let eraserCircle = null;
let eraserSize = 30;

L.marker(TUBRICA_LOCATION, { interactive: false })
  .addTo(map)
  .bindPopup("📍 SEDE TUBRICA")
  .openPopup();

// --- MUNICIPIOS ---
async function cargarMunicipios() {
  const zonas = [
    { name: "Iribarren", id: 2211603, color: "#2980b9" },
    { name: "Palavecino", id: 2211604, color: "#27ae60" },
    { name: "P. Ayacucho", id: 7293700, color: "#c0392b" },
  ];
  zonas.forEach((z) => {
    fetch(
      `https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=${z.id}&class=boundary&addressdetails=1&format=json&polygon_geojson=1`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.geometry) {
          L.geoJSON(data.geometry, {
            interactive: false,
            style: {
              color: z.color,
              weight: 3,
              opacity: 0.6,
              fillColor: z.color,
              fillOpacity: 0.1,
            },
          }).addTo(boundaryLayer);
          const center = L.geoJSON(data.geometry).getBounds().getCenter();
          L.marker(center, {
            icon: L.divIcon({ className: "label-municipio", html: z.name }),
            interactive: false,
          }).addTo(boundaryLayer);
        }
      });
  });
}
cargarMunicipios();

// --- PERSISTENCIA (CARGA) ---
async function loadData() {
  try {
    const res = await fetch("/api/elements");
    const data = await res.json();
    data.forEach((el) => {
      const geo =
        typeof el.geometry === "string" ? JSON.parse(el.geometry) : el.geometry;
      if (el.type === "route") renderRoute(geo, el.name, el.id);
      else renderMarker(geo, el.name, el.id);
    });
  } catch (e) {
    console.error("Error cargando DB:", e);
  }
}
loadData();

// --- RENDERIZADO DE RUTAS ---
function renderRoute(latlngs, name, id) {
  if (!latlngs || latlngs.length < 2) return;
  const poly = L.polyline(latlngs, { color: "#3498db", weight: 6 });
  const start = L.circleMarker(latlngs[0], {
    radius: 5,
    color: "#2ecc71",
    fillColor: "white",
    fillOpacity: 1,
  });
  const end = L.circleMarker(latlngs[latlngs.length - 1], {
    radius: 5,
    color: "#e74c3c",
    fillColor: "white",
    fillOpacity: 1,
  });
  const label = L.marker([0, 0], {
    interactive: false,
    icon: L.divIcon({ className: "route-label", html: "" }),
  });

  const group = L.layerGroup([poly, label, start, end]);
  group.dbId = id;
  group.type = "route";
  group.name = name;
  group.routeLine = poly;
  group.isDirty = false;

  const update = (pts) => {
    let m = 0;
    for (let i = 1; i < pts.length; i++) m += map.distance(pts[i - 1], pts[i]);
    const dist = (m / 1000).toFixed(1);
    const time = Math.round(m / 11.11 / 60);
    label.setLatLng(pts[Math.floor(pts.length / 2)]);
    label.setIcon(
      L.divIcon({
        className: "route-label",
        html: `<div class="route-text"><span class="route-name">${name}</span><span class="route-stats">${dist}km | ${time}m</span></div>`,
      }),
    );
    start.setLatLng(pts[0]);
    end.setLatLng(pts[pts.length - 1]);
  };
  update(latlngs);

  [poly, start, end].forEach((l) =>
    l.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      if (currentMode === "delete") handleDelete(group);
      else if (currentMode === "edit") {
        if (poly.editing.enabled()) {
          poly.editing.disable();
          saveLayer(group);
        } else poly.editing.enable();
      }
    }),
  );

  poly.on("edit", () => {
    update(poly.getLatLngs());
    group.isDirty = true;
  });
  group.addTo(drawnItems);
}

// ==========================================
// 5. HERRAMIENTAS DE TRAZADO (INTELIGENTE Y MANUAL)
// ==========================================

// Función para llamar a OSRM y guardar
async function procesarRutaOSRM(puntos) {
  const coords = puntos.map((p) => `${p.lng},${p.lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const pts = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
      const name = prompt("Nombre de la ruta:");
      if (name) {
        const id = await saveElement(name, "route", pts);
        renderRoute(pts, name, id);
      }
    }
  } catch (e) {
    alert("Error al obtener la ruta.");
  }
  resetModes();
}

// Manejador de clics en el mapa
map.on("click", (e) => {
  console.log("Clic en mapa. Modo actual:", currentMode);

  if (currentMode === "marker") {
    const n = prompt("Nombre del marcador:");
    if (n)
      saveElement(n, "marker", e.latlng).then((id) =>
        renderMarker(e.latlng, n, id),
      );
  } else if (currentMode === "smart") {
    smartRoutePoints.push(e.latlng);

    // Marcador naranja visual
    const m = L.circleMarker(e.latlng, {
      radius: 8,
      color: "#e67e22",
      fillColor: "white",
      fillOpacity: 1,
      interactive: true,
    }).addTo(map);

    // Al hacer clic en un punto naranja, se finaliza la ruta
    m.on("click", (ev) => {
      L.DomEvent.stopPropagation(ev);
      if (smartRoutePoints.length >= 2) {
        procesarRutaOSRM(smartRoutePoints);
      } else {
        alert("Seleccione al menos 2 puntos.");
      }
    });

    tempMarkers.push(m);

    // Actualizar línea punteada
    if (smartRoutePoints.length >= 2) {
      const coordsPreview = smartRoutePoints
        .map((p) => `${p.lng},${p.lat}`)
        .join(";");
      fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordsPreview}?overview=full&geometries=geojson`,
      )
        .then((r) => r.json())
        .then((data) => {
          if (previewLine) map.removeLayer(previewLine);
          previewLine = L.polyline(
            data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]),
            {
              color: "#e67e22",
              weight: 4,
              dashArray: "5,10",
              interactive: false,
            },
          ).addTo(map);
        });
    }
  } else if (currentMode === "to-tubrica") {
    procesarRutaOSRM([e.latlng, TUBRICA_LOCATION]);
  }
});

// ==========================================
// 6. FUNCIONES GLOBALES (PARA EL HTML)
// ==========================================

window.toggleSmartRoute = function () {
  resetModes();
  currentMode = "smart";
  document.getElementById("status").innerText =
    "Modo: Ruta Inteligente (Marque puntos, clic en punto naranja para finalizar)";
};

window.enableManualDraw = function () {
  resetModes();
  currentMode = "manual";
  const drawer = new L.Draw.Polyline(map, {
    shapeOptions: { color: "#3498db", weight: 6 },
  });
  drawer.enable();
};

window.toggleGoToTubrica = function () {
  resetModes();
  currentMode = "to-tubrica";
  document.getElementById("status").innerText =
    "Modo: Ruta hacia Tubrica (Clic origen)";
};

window.enableMarker = function () {
  resetModes();
  currentMode = "marker";
  document.getElementById("status").innerText = "Modo: Marcador";
};

window.enableEditMode = function () {
  resetModes();
  currentMode = "edit";
  document.getElementById("status").innerText = "Modo: Edición (Clic en ruta)";
};

window.enableDelete = function () {
  resetModes();
  currentMode = "delete";
  document.getElementById("status").innerText =
    "Modo: Eliminar (Clic en objeto)";
};

window.toggleEraser = function () {
  if (currentMode === "eraser") return resetModes();
  resetModes();
  currentMode = "eraser";
  eraserCircle = L.circle([0, 0], {
    radius: eraserSize,
    color: "red",
    fillOpacity: 0.2,
    interactive: false,
  }).addTo(map);
  map.getContainer().style.cursor = "crosshair";
  document.getElementById("status").innerText = "Modo: Borrador";
};

// ==========================================
// 7. PERSISTENCIA (POST / PUT / DELETE)
// ==========================================

async function saveElement(n, t, g) {
  const res = await fetch("/api/elements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: n, type: t, geometry: g }),
  });
  const d = await res.json();
  return d.id;
}

async function saveLayer(l) {
  await fetch(`/api/elements/${l.dbId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ geometry: l.routeLine.getLatLngs() }),
  });
  l.isDirty = false;
}

window.saveAllChanges = async function () {
  const promises = [];
  drawnItems.eachLayer((l) => {
    if (l.isDirty) promises.push(saveLayer(l));
  });
  await Promise.all(promises);
  alert("Cambios sincronizados.");
};

async function handleDelete(l) {
  if (confirm("¿Borrar permanentemente?")) {
    await fetch(`/api/elements/${l.dbId}`, { method: "DELETE" });
    drawnItems.removeLayer(l);
  }
}

// ==========================================
// 8. UTILIDADES Y EVENTOS EXTRAS
// ==========================================

function resetModes() {
  currentMode = null;
  smartRoutePoints = [];
  drawnItems.eachLayer((g) => {
    if (g.routeLine?.editing) g.routeLine.editing.disable();
  });
  tempMarkers.forEach((m) => map.removeLayer(m));
  tempMarkers = [];
  if (previewLine) map.removeLayer(previewLine);
  if (eraserCircle) map.removeLayer(eraserCircle);
  previewLine = null;
  eraserCircle = null;
  map.getContainer().style.cursor = "";
  document.getElementById("status").innerText = "Modo: Inactivo";
}

// Borrador dinámico
map.on("mousemove", (e) => {
  if (currentMode !== "eraser" || !eraserCircle) return;
  eraserCircle.setLatLng(e.latlng);
  drawnItems.eachLayer((g) => {
    if (g.type !== "route") return;
    const pts = g.routeLine.getLatLngs();
    const filt = pts.filter((p) => map.distance(p, e.latlng) > eraserSize);
    if (filt.length !== pts.length) {
      if (filt.length < 2) g.toDelete = true;
      else {
        g.routeLine.setLatLngs(filt);
        g.isDirty = true;
        g.routeLine.fire("edit");
      }
    }
  });
});

map.on("mouseup", async () => {
  if (currentMode !== "eraser") return;
  drawnItems.eachLayer(async (g) => {
    if (g.toDelete) {
      await fetch(`/api/elements/${g.dbId}`, { method: "DELETE" });
      drawnItems.removeLayer(g);
    } else if (g.isDirty) saveLayer(g);
  });
});

// Finalizar dibujo manual
map.on(L.Draw.Event.CREATED, (e) => {
  const n = prompt("Nombre de la ruta:");
  if (n)
    saveElement(n, "route", e.layer.getLatLngs()).then((id) =>
      renderRoute(e.layer.getLatLngs(), n, id),
    );
});

function renderMarker(latlng, name, id) {
  const m = L.marker(latlng).bindPopup(name);
  m.dbId = id;
  m.on("click", (e) => {
    L.DomEvent.stopPropagation(e);
    if (currentMode === "delete") handleDelete(m);
  });
  m.addTo(drawnItems);
}

window.toggleSidebar = function () {
  document.getElementById("sidebar").classList.toggle("collapsed");
  setTimeout(() => map.invalidateSize(), 300);
};

window.exportMapToPDF = function () {
  html2canvas(document.getElementById("map"), { useCORS: true, scale: 2 }).then(
    (canvas) => {
      const pdf = new jspdf.jsPDF("l", "mm", "a4");
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 297, 210);
      pdf.save("mapa_tubrica.pdf");
    },
  );
};

document.getElementById("eraserSlider").oninput = (e) => {
  eraserSize = parseInt(e.target.value);
  if (eraserCircle) eraserCircle.setRadius(eraserSize);
};

//carga automatica

// ==========================================
// 1. CONFIGURACIÓN Y DATASET
// ==========================================
const TUBRICA_LOCATION = L.latLng(10.09673945749423, -69.35846137671071);

const OMEGA_DATA = [
  {
    name: "OESTE (Administrativo)",
    km: 40.0,
    coords: [
      [10.065, -69.39],
      [10.075, -69.385],
      [10.088, -69.365],
      [10.0967, -69.3584],
    ],
  },
  {
    name: "SUR OESTE",
    km: 21.2,
    coords: [
      [10.052, -69.358],
      [10.065, -69.366],
      [10.082, -69.36],
      [10.0967, -69.3584],
    ],
  },
  {
    name: "PAVIA",
    km: 12.9,
    coords: [
      [10.125, -69.412],
      [10.11, -69.39],
      [10.1, -69.37],
      [10.0967, -69.3584],
    ],
  },
  {
    name: "CABUDARE (Rotativo)",
    km: 30.0,
    coords: [
      [10.03, -69.26],
      [10.05, -69.28],
      [10.08, -69.33],
      [10.0967, -69.3584],
    ],
  },
  {
    name: "CABUDARE A",
    km: 33.0,
    coords: [
      [10.01, -69.25],
      [10.02, -69.27],
      [10.04, -69.3],
      [10.0967, -69.3584],
    ],
  },
  {
    name: "CABUDARE B",
    km: 40.5,
    coords: [
      [10.005, -69.24],
      [10.015, -69.26],
      [10.05, -69.31],
      [10.0967, -69.3584],
    ],
  },
  {
    name: "RUEZGA / UNION",
    km: 30.0,
    coords: [
      [10.09, -69.32],
      [10.1, -69.33],
      [10.0967, -69.3584],
    ],
  },
  {
    name: "ESTE-CENTRO",
    km: 30.0,
    coords: [
      [10.075, -69.29],
      [10.07, -69.31],
      [10.085, -69.34],
      [10.0967, -69.3584],
    ],
  },
  {
    name: "NORTE (Rotativo)",
    km: 20.0,
    coords: [
      [10.15, -69.3],
      [10.12, -69.32],
      [10.1, -69.34],
      [10.0967, -69.3584],
    ],
  },
  {
    name: "ESTE 1",
    km: 38.7,
    coords: [
      [10.08, -69.27],
      [10.09, -69.29],
      [10.0967, -69.3584],
    ],
  },
  {
    name: "ESTE 2",
    km: 22.5,
    coords: [
      [10.085, -69.265],
      [10.095, -69.3],
      [10.0967, -69.3584],
    ],
  },
  {
    name: "MANZANO CENTRO",
    km: 25.1,
    coords: [
      [10.04, -69.32],
      [10.06, -69.33],
      [10.0967, -69.3584],
    ],
  },
];

const map = L.map("map", {
  preferCanvas: false,
  doubleClickZoom: false,
  zoomControl: false,
}).setView(TUBRICA_LOCATION, 12);
L.control.zoom({ position: "bottomright" }).addTo(map);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  crossOrigin: true,
}).addTo(map);

const boundaryLayer = L.layerGroup().addTo(map);
const omegaLayer = L.layerGroup().addTo(map);
const drawnItems = L.featureGroup().addTo(map);

let currentMode = null,
  smartRoutePoints = [],
  tempMarkers = [],
  previewLine = null,
  eraserCircle = null,
  eraserSize = 30;

L.marker(TUBRICA_LOCATION, { interactive: false })
  .addTo(map)
  .bindPopup("<b>📍 SEDE TUBRICA</b>")
  .openPopup();

// --- INICIALIZACIÓN ---
async function init() {
  cargarMunicipios();
  loadData();
  generarMenuOmega();
}
init();

// ==========================================
// 2. LÓGICA DE RUTAS OMEGA
// ==========================================
function generarMenuOmega() {
  const list = document.getElementById("omega-route-list");
  OMEGA_DATA.forEach((route, i) => {
    const layer = renderRoute(
      route.coords,
      route.name,
      `omega-${i}`,
      null,
      true,
    );
    const item = document.createElement("div");
    item.className = "omega-item";
    item.innerHTML = `
            <input type="checkbox" checked onchange="toggleOmegaLayer(${i}, this.checked)">
            <span onclick="focusRoute(${i})">${route.name}</span>
        `;
    list.appendChild(item);
    route.layer = layer;
  });
}

function toggleOmegaLayer(i, show) {
  if (show) omegaLayer.addLayer(OMEGA_DATA[i].layer);
  else omegaLayer.removeLayer(OMEGA_DATA[i].layer);
}

function toggleAllOmega(show) {
  OMEGA_DATA.forEach((r, i) => {
    const chk = document.querySelectorAll(".omega-item input")[i];
    chk.checked = show;
    toggleOmegaLayer(i, show);
  });
}

function focusRoute(i) {
  const poly = OMEGA_DATA[i].layer
    .getLayers()
    .find((l) => l instanceof L.Polyline);
  map.fitBounds(poly.getBounds(), { padding: [50, 50] });
}

// ==========================================
// 3. RENDERIZADO Y EDICIÓN
// ==========================================
function renderRoute(latlngs, name, id, dur = null, isOmega = false) {
  if (!latlngs || latlngs.length < 2) return;
  const poly = L.polyline(latlngs, {
    color: isOmega ? "#e67e22" : "#3498db",
    weight: 5,
    smoothFactor: 1.5,
  });
  const start = L.circleMarker(latlngs[0], {
    radius: 4,
    color: "#2ecc71",
    fillColor: "white",
    fillOpacity: 1,
  });
  const end = L.circleMarker(latlngs[latlngs.length - 1], {
    radius: 4,
    color: "#e74c3c",
    fillColor: "white",
    fillOpacity: 1,
  });
  const label = L.marker([0, 0], {
    interactive: false,
    icon: L.divIcon({ className: "route-label", html: "", iconSize: null }),
  });

  const group = L.layerGroup([poly, label, start, end]);
  group.dbId = id;
  group.type = "route";
  group.name = name;
  group.routeLine = poly;
  group.isDirty = false;

  const update = (pts) => {
    let m = 0;
    for (let i = 1; i < pts.length; i++) m += map.distance(pts[i - 1], pts[i]);
    const dist = (m / 1000).toFixed(1);
    const time = Math.round(m / 11.11 / 60);
    label.setLatLng(pts[Math.floor(pts.length / 2)]);
    label.setIcon(
      L.divIcon({
        className: "route-label",
        html: `<div class="route-text"><span class="route-name">${name}</span><span class="route-stats">${dist}km | ${time}m</span></div>`,
        iconAnchor: [0, 0],
      }),
    );
    start.setLatLng(pts[0]);
    end.setLatLng(pts[pts.length - 1]);
  };
  update(latlngs);

  [poly, start, end].forEach((l) =>
    l.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      if (currentMode === "delete") handleDelete(group);
      else if (currentMode === "edit") {
        if (poly.editing.enabled()) {
          poly.editing.disable();
          saveLayer(group);
        } else poly.editing.enable();
      }
    }),
  );
  poly.on("edit", () => {
    update(poly.getLatLngs());
    group.isDirty = true;
  });

  if (isOmega) group.addTo(omegaLayer);
  else group.addTo(drawnItems);
  return group;
}

// ==========================================
// 4. FUNCIONALIDADES DE HERRAMIENTAS
// ==========================================
map.on("click", (e) => {
  if (currentMode === "marker") {
    const n = prompt("Nombre:");
    if (n)
      saveElement(n, "marker", e.latlng).then((id) =>
        renderMarker(e.latlng, n, id),
      );
  } else if (currentMode === "smart") {
    smartRoutePoints.push(e.latlng);
    const m = L.circleMarker(e.latlng, {
      radius: 7,
      color: "#e67e22",
      fillColor: "white",
      fillOpacity: 1,
    }).addTo(map);
    m.on("click", (ev) => {
      L.DomEvent.stopPropagation(ev);
      if (smartRoutePoints.length >= 2) finalizeSmart();
    });
    tempMarkers.push(m);
    if (smartRoutePoints.length >= 2) updatePreview();
  } else if (currentMode === "to-tubrica")
    fetchOSRM([e.latlng, TUBRICA_LOCATION]);
});

async function finalizeSmart() {
  const coords = smartRoutePoints.map((p) => `${p.lng},${p.lat}`).join(";");
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
  );
  const data = await res.json();
  if (data.routes) {
    const pts = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
    const n = prompt("Nombre:");
    if (n) saveElement(n, "route", pts).then((id) => renderRoute(pts, n, id));
  }
  resetModes();
}

async function updatePreview() {
  const coords = smartRoutePoints.map((p) => `${p.lng},${p.lat}`).join(";");
  fetch(
    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
  )
    .then((r) => r.json())
    .then((data) => {
      if (previewLine) map.removeLayer(previewLine);
      if (data.routes)
        previewLine = L.polyline(
          data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]),
          { color: "#e67e22", weight: 3, dashArray: "5,10" },
        ).addTo(map);
    });
}

// ==========================================
// 5. MUNICIPIOS Y PERSISTENCIA
// ==========================================
async function cargarMunicipios() {
  const zonas = [
    { name: "Iribarren", id: 2211603, col: "#2980b9" },
    { name: "Palavecino", id: 2211604, col: "#27ae60" },
    { name: "P. Ayacucho", id: 7293700, col: "#c0392b" },
  ];
  zonas.forEach((z) => {
    fetch(
      `https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=${z.id}&class=boundary&format=json&polygon_geojson=1`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.geometry) {
          L.geoJSON(data.geometry, {
            interactive: false,
            style: {
              color: z.col,
              weight: 2,
              opacity: 0.5,
              fillColor: z.col,
              fillOpacity: 0.05,
            },
          }).addTo(boundaryLayer);
          L.marker(L.geoJSON(data.geometry).getBounds().getCenter(), {
            icon: L.divIcon({ className: "label-municipio", html: z.name }),
            interactive: false,
          }).addTo(boundaryLayer);
        }
      });
  });
}

async function saveAllChanges() {
  const p = [];
  drawnItems.eachLayer((l) => {
    if (l.isDirty) p.push(saveLayer(l));
  });
  await Promise.all(p);
  alert("Sincronizado");
}

async function saveLayer(l) {
  await fetch(`/api/elements/${l.dbId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ geometry: l.routeLine.getLatLngs() }),
  });
  l.isDirty = false;
}

async function loadData() {
  const res = await fetch("/api/elements");
  const data = await res.json();
  data.forEach((el) => {
    let geo =
      typeof el.geometry === "string" ? JSON.parse(el.geometry) : el.geometry;
    if (el.type === "route") renderRoute(geo, el.name, el.id);
    else renderMarker(geo, el.name, el.id);
  });
}

// ==========================================
// 6. EXPORTACIÓN PDF ALTA CALIDAD
// ==========================================
window.exportMapToPDF = function () {
  const btn = document.querySelector(".btn-pdf");
  btn.innerHTML = "⏳ Generando...";
  html2canvas(document.getElementById("map"), { useCORS: true, scale: 3 }).then(
    (canvas) => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("l", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      pdf.setFontSize(14);
      pdf.text("REPORTE GEOGRÁFICO DE RUTAS - TUBRICA", 10, 12);
      pdf.setFontSize(8);
      pdf.text(`Generado: ${new Date().toLocaleString()}`, 10, 18);

      pdf.addImage(imgData, "PNG", 10, 22, 277, 175);
      pdf.save(`Transporte_Tubrica_${new Date().getTime()}.pdf`);
      btn.innerHTML = "📄 Exportar PDF";
    },
  );
};

// ==========================================
// 7. UTILIDADES (SIDEBAR / MODOS)
// ==========================================
function resetModes() {
  currentMode = null;
  smartRoutePoints = [];
  [drawnItems, omegaLayer].forEach((layer) =>
    layer.eachLayer((g) => {
      if (g.routeLine?.editing) g.routeLine.editing.disable();
    }),
  );
  tempMarkers.forEach((m) => map.removeLayer(m));
  tempMarkers = [];
  if (previewLine) map.removeLayer(previewLine);
  if (eraserCircle) map.removeLayer(eraserCircle);
  previewLine = null;
  eraserCircle = null;
  map.getContainer().style.cursor = "";
  document.getElementById("status").innerText = "Modo: Inactivo";
}

window.toggleSidebar = () => {
  document.getElementById("sidebar").classList.toggle("collapsed");
  setTimeout(() => map.invalidateSize(), 300);
};
window.enableManualDraw = () => {
  resetModes();
  currentMode = "manual";
  new L.Draw.Polyline(map, {
    shapeOptions: { color: "#3498db", weight: 5 },
  }).enable();
};
window.toggleSmartRoute = () => {
  resetModes();
  currentMode = "smart";
};
window.toggleGoToTubrica = () => {
  resetModes();
  currentMode = "to-tubrica";
};
window.enableMarker = () => {
  resetModes();
  currentMode = "marker";
};
window.enableEditMode = () => {
  resetModes();
  currentMode = "edit";
};
window.enableDelete = () => {
  resetModes();
  currentMode = "delete";
};
window.toggleEraser = () => {
  resetModes();
  currentMode = "eraser";
  eraserCircle = L.circle([0, 0], {
    radius: eraserSize,
    color: "red",
    fillOpacity: 0.1,
  }).addTo(map);
};

map.on(L.Draw.Event.CREATED, (e) => {
  const n = prompt("Nombre:");
  if (n)
    saveElement(n, "route", e.layer.getLatLngs()).then((id) =>
      renderRoute(e.layer.getLatLngs(), n, id),
    );
});
map.on("mousemove", (e) => {
  if (currentMode !== "eraser" || !eraserCircle) return;
  eraserCircle.setLatLng(e.latlng);
  drawnItems.eachLayer((g) => {
    if (g.type !== "route") return;
    const pts = g.routeLine.getLatLngs();
    const filt = pts.filter((p) => map.distance(p, e.latlng) > eraserSize);
    if (filt.length !== pts.length) {
      if (filt.length < 2) g.toDelete = true;
      else {
        g.routeLine.setLatLngs(filt);
        g.isDirty = true;
        updateStatsManual(g);
      }
    }
  });
});

async function saveElement(n, t, g) {
  const res = await fetch("/api/elements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: n, type: t, geometry: g }),
  });
  const d = await res.json();
  return d.id;
}

function renderMarker(latlng, name, id) {
  const m = L.marker(latlng).bindPopup(name);
  m.dbId = id;
  m.on("click", (e) => {
    L.DomEvent.stopPropagation(e);
    if (currentMode === "delete") handleDelete(m);
  });
  m.addTo(drawnItems);
}

async function handleDelete(l) {
  if (confirm("¿Borrar?")) {
    await fetch(`/api/elements/${l.dbId}`, { method: "DELETE" });
    [drawnItems, omegaLayer].forEach((layer) => layer.removeLayer(l));
  }
}

document.getElementById("eraserSlider").oninput = (e) => {
  eraserSize = parseInt(e.target.value);
  if (eraserCircle) eraserCircle.setRadius(eraserSize);
};
