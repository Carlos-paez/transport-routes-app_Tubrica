// ==========================================
// 1. CONFIGURACIÓN Y DATASET OMEGA COMPLETO (17 RUTAS)
// ==========================================
const TUBRICA_LOCATION = L.latLng(10.09673945749423, -69.35846137671071);

// Dataset extraído íntegramente del PDF (Páginas 1 y 2)
const OMEGA_WAYPOINTS = [
  // --- PAGINA 1 ---
  {
    name: "OESTE (Admin)",
    points: [
      [10.063, -69.395],
      [10.07, -69.39],
      [10.073, -69.375],
      [10.09, -69.378],
      [10.0967, -69.3584],
    ],
    desc: "Cerro Mara - La Y - Rio Linare - El Caribe - El Tostado - TUBRICA",
  },
  {
    name: "SUR OESTE (Admin)",
    points: [
      [10.052, -69.358],
      [10.055, -69.362],
      [10.065, -69.368],
      [10.075, -69.355],
      [10.0967, -69.3584],
    ],
    desc: "Horcones - Carucieña - Cerrajones - Ruiz Pineda - Sta Isabel - TUBRICA",
  },
  {
    name: "PAVIA (Admin)",
    points: [
      [10.101963955594941, -69.4369901160083],
      [10.076212201255366, -69.4002094662229],
      [10.09673919002261, -69.35846256186029],
    ],
    desc: "Punto Fe y Alegría - Altos de Pavía - TUBRICA",
  },
  {
    name: "SUR OESTE (Rot)",
    points: [
      [10.052, -69.358],
      [10.06, -69.365],
      [10.068, -69.36],
      [10.0967, -69.3584],
    ],
    desc: "Gimnasio Los Horcones - Carucieña - Ruiz Pineda - TUBRICA",
  },
  {
    name: "OESTE (Rot)",
    points: [
      [10.063, -69.395],
      [10.072, -69.388],
      [10.082, -69.375],
      [10.0967, -69.3584],
    ],
    desc: "Cerro Mara - La Y - Rio Linare - Nueva Paz - Valle Dorado - TUBRICA",
  },
  {
    name: "CABUDARE (Rot)",
    points: [
      [10.035, -69.268],
      [10.042, -69.285],
      [10.051, -69.282],
      [10.078, -69.335],
      [10.0967, -69.3584],
    ],
    desc: "Trigal - Plaza Bolivar - Chucho Briceño - Agua Viva - TUBRICA",
  },
  {
    name: "PAVIA (Rot)",
    points: [
      [10.102243296082907, -69.43746036939227],
      [10.076212201255366, -69.4002094662229],
      [10.09673919002261, -69.35846256186029],
    ],
    desc: "C.C. Quatro's C.A. - TUBRICA",
  },
  {
    name: "CABUDARE A (Admin)",
    points: [
      [10.012, -69.255],
      [10.021, -69.268],
      [10.035, -69.278],
      [10.045, -69.305],
      [10.0967, -69.3584],
    ],
    desc: "Loma Alta - Agua Viva - Fermin Toro - Cabudare Centro - Ribereña - TUBRICA",
  },
  {
    name: "CABUDARE B (Admin)",
    points: [
      [10.002, -69.245],
      [10.018, -69.265],
      [10.025, -69.295],
      [10.048, -69.315],
      [10.0967, -69.3584],
    ],
    desc: "El Recreo - La Campiña - La Mora - El Palmar - TUBRICA",
  },
  {
    name: "RUEZGA / UNION (Rot)",
    points: [
      [10.108, -69.315],
      [10.102, -69.325],
      [10.095, -69.332],
      [10.088, -69.345],
      [10.0967, -69.3584],
    ],
    desc: "Ruezga Sect 4 y 7 - Santos Luzardo - B. Union - La Peña - TUBRICA",
  },
  {
    name: "ESTE-CENTRO (Rot)",
    points: [
      [10.078, -69.295],
      [10.072, -69.305],
      [10.065, -69.312],
      [10.082, -69.338],
      [10.0967, -69.3584],
    ],
    desc: "Rio Lama - Vargas - Libertador - Metropolis - Seguro - TUBRICA",
  },
  {
    name: "NORTE (Rot)",
    points: [
      [10.155, -69.305],
      [10.132, -69.325],
      [10.125, -69.338],
      [10.108, -69.348],
      [10.0967, -69.3584],
    ],
    desc: "Ali Primera - Yucatan - Via Duaca - El Cuji - Circunvalacion - TUBRICA",
  },
  {
    name: "ESTE 1 (Admin)",
    points: [
      [10.082, -69.228],
      [10.085, -69.255],
      [10.078, -69.28],
      [10.088, -69.298],
      [10.0967, -69.3584],
    ],
    desc: "Plaza del Cercado - Brisas del Este - Los Proceres - El Jebe - TUBRICA",
  },
  {
    name: "ESTE 2 (Admin)",
    points: [
      [10.005, -69.242],
      [10.015, -69.265],
      [10.035, -69.295],
      [10.0967, -69.3584],
    ],
    desc: "El Recreo - Piedad Norte - La Mora - TUBRICA",
  },
  {
    name: "MANZANO CENTRO (Admin)",
    points: [
      [10.042, -69.325],
      [10.058, -69.335],
      [10.068, -69.335],
      [10.075, -69.315],
      [10.085, -69.345],
      [10.0967, -69.3584],
    ],
    desc: "Puente Macuto - Carr 18 - Calle 24, 35 y 54 - TUBRICA",
  },
  // --- PAGINA 2 ---
  {
    name: "NORTE (Admin)",
    points: [
      [10.206372210955742, -69.30584636546004],
      [10.200856688748825, -69.30466524850138],
      [10.160180927668621, -69.31536263157473],
      [10.157543563660772, -69.31991577890504],
      [10.150661968584746, -69.31536013377229],
      [10.106394505275713, -69.32653213802232],
      [10.098970543680181, -69.35439162942978],
      [10.098543698731946, -69.35458657496032],
      [10.096740149398737, -69.35844076694916],
    ],
    desc: "Yucatan - Tamaca - Sabana Grande - Macias Mujica - Zona Ind II - TUBRICA",
  },
  {
    name: "RUEZGA / UNION (Admin)",
    points: [
      [10.102015067019032, -69.33458629573151],
      [10.098963762024699, -69.33325106601977],
      [10.097009673728325, -69.33113748525108],
      [10.089174319765958, -69.32882803130896],
      [10.088809898525101, -69.33009403400054],
      [10.087156794104592, -69.3298016731991],
      [10.08884158734706, -69.33118032864812],
      [10.090347079495286, -69.33171842129163],
      [10.09063844031557, -69.33175506366452],
      [10.09077748495229, -69.33178688136164],
      [10.09146629041387, -69.33176048572396],
      [10.093744639904859, -69.33224084725906],
      [10.093493413182822, -69.33585796949542],
      [10.091034521245547, -69.33574314019548],
      [10.089963889151008, -69.33557556123255],
      [10.087672202272339, -69.3480262031196],
      [10.086533880588435, -69.34936200723237],
      [10.085312548045113, -69.34892895889281],
      [10.081501960822061, -69.34946124740897],
      [10.083722588207095, -69.34927629968347],
      [10.086467262550498, -69.34961912958794],
      [10.086240999758296, -69.3509962782471],
      [10.085617322097857, -69.3579113117615],
      [10.083916821628973, -69.35851551832934],
      [10.079312920284323, -69.36211988169612],
      [10.0743320907289, -69.37016431026224],
      [10.07139254867341, -69.37082776826064],
      [10.074267204448484, -69.37907216326282],
      [10.08584924401383, -69.37006444454457],
      [10.089159478406902, -69.36632811172477],
      [10.090638285043777, -69.36722933400247],
      [10.092591622549229, -69.3644841578903],
      [10.088088298261177, -69.35970258275245],
      [10.091646764883889, -69.35621685518034],
      [10.092188582313796, -69.35634316094072],
      [10.09665966024831, -69.35843952529602],
    ],
    desc: "Circunvalacion - Barrio Lindo - Los Luises - Delicia - Crepusculos - TUBRICA",
  },
];

// ==========================================
// 2. INICIALIZACIÓN DEL MAPA (preferCanvas: true para fix de PDF)
// ==========================================
const map = L.map("map", {
  preferCanvas: true,
  doubleClickZoom: false,
  zoomControl: false,
}).setView(TUBRICA_LOCATION, 13);

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

async function init() {
  cargarMunicipios();
  loadData();
  await cargarRutasOmegaInteligentes();
}
init();

// ==========================================
// 3. TRAZADO INTELIGENTE (OSRM)
// ==========================================
async function cargarRutasOmegaInteligentes() {
  const list = document.getElementById("omega-route-list");
  list.innerHTML = ""; // Limpiar antes de cargar

  for (let i = 0; i < OMEGA_WAYPOINTS.length; i++) {
    const routeData = OMEGA_WAYPOINTS[i];
    const coordsStr = routeData.points.map((p) => `${p[1]},${p[0]}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const polyCoords = data.routes[0].geometry.coordinates.map((c) => [
          c[1],
          c[0],
        ]);
        const layer = renderRoute(
          polyCoords,
          routeData.name,
          `omega-${i}`,
          null,
          true,
        );

        const item = document.createElement("div");
        item.className = "omega-item";
        item.innerHTML = `
                    <input type="checkbox" checked onchange="toggleOmegaLayer(${i}, this.checked)">
                    <span onclick="focusRoute(${i})" title="${routeData.desc}">${routeData.name}</span>
                `;
        list.appendChild(item);
        OMEGA_WAYPOINTS[i].layer = layer;
      }
    } catch (e) {
      console.error("Error cargando:", routeData.name);
    }
  }
}

function toggleOmegaLayer(i, show) {
  if (show) omegaLayer.addLayer(OMEGA_WAYPOINTS[i].layer);
  else omegaLayer.removeLayer(OMEGA_WAYPOINTS[i].layer);
}

function focusRoute(i) {
  const poly = OMEGA_WAYPOINTS[i].layer
    .getLayers()
    .find((l) => l instanceof L.Polyline);
  map.fitBounds(poly.getBounds(), { padding: [50, 50] });
}

function toggleAllOmega(show) {
  OMEGA_WAYPOINTS.forEach((r, i) => {
    const checks = document.querySelectorAll(".omega-item input");
    if (checks[i]) {
      checks[i].checked = show;
      toggleOmegaLayer(i, show);
    }
  });
}

// ==========================================
// 4. RENDERIZADO Y HERRAMIENTAS
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

  group.refreshStats = function () {
    const pts = poly.getLatLngs();
    if (pts.length < 2) return;
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
  group.refreshStats();

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
    group.refreshStats();
    group.isDirty = true;
  });

  if (isOmega) group.addTo(omegaLayer);
  else group.addTo(drawnItems);
  return group;
}

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
  } else if (currentMode === "to-tubrica") {
    fetchOSRMDirect([e.latlng, TUBRICA_LOCATION]);
  }
});

async function fetchOSRMDirect(points) {
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.routes && data.routes.length > 0) {
    const full = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
    const name = prompt("Nombre de ruta a TUBRICA:");
    if (name) renderRoute(full, name, await saveElement(name, "route", full));
  }
  resetModes();
}

// ==========================================
// 5. BORRADOR Y PDF
// ==========================================
map.on("mousemove", (e) => {
  if (currentMode !== "eraser" || !eraserCircle) return;
  eraserCircle.setLatLng(e.latlng);
  [drawnItems, omegaLayer].forEach((lg) =>
    lg.eachLayer((g) => {
      if (g.type !== "route") return;
      const poly = g.routeLine;
      const pts = poly.getLatLngs();
      const filt = pts.filter((p) => map.distance(p, e.latlng) > eraserSize);
      if (filt.length !== pts.length) {
        poly.setLatLngs(filt);
        g.isDirty = true;
        g.refreshStats();
      }
    }),
  );
});

map.on("mouseup", async () => {
  if (currentMode === "eraser") {
    drawnItems.eachLayer(async (g) => {
      if (g.isDirty && g.dbId) await saveLayer(g);
    });
  }
});

window.exportMapToPDF = function () {
  const btn = document.querySelector(".btn-pdf");
  btn.innerHTML = "⏳ Generando Alta Calidad...";
  setTimeout(() => {
    html2canvas(document.getElementById("map"), {
      useCORS: true,
      scale: 3,
    }).then((canvas) => {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 22, 277, 175);
      pdf.setFontSize(14);
      pdf.text("REPORTE LOGÍSTICO - TUBRICA", 10, 12);
      pdf.save(`Rutas_Transporte_${new Date().getTime()}.pdf`);
      btn.innerHTML = "📄 Exportar PDF";
    });
  }, 500);
};

// ==========================================
// OTROS
// ==========================================
async function cargarMunicipios() {
  const zonas = [
    { name: "Iribarren", id: 2211603, col: "#2980b9" },
    { name: "Palavecino", id: 2211604, col: "#27ae60" },
    { name: "Ayacucho", id: 7293700, col: "#c0392b" },
  ];
  zonas.forEach((z) => {
    fetch(
      `https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=${z.id}&class=boundary&format=json&polygon_geojson=1`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.geometry)
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
      });
  });
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

async function saveLayer(l) {
  if (!l.dbId || String(l.dbId).startsWith("omega")) return;
  await fetch(`/api/elements/${l.dbId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ geometry: l.routeLine.getLatLngs() }),
  });
  l.isDirty = false;
}

async function saveElement(n, t, g) {
  const res = await fetch("/api/elements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: n, type: t, geometry: g }),
  });
  const d = await res.json();
  return d.id;
}

async function saveAllChanges() {
  const p = [];
  drawnItems.eachLayer((l) => {
    if (l.isDirty) p.push(saveLayer(l));
  });
  await Promise.all(p);
  alert("Sincronizado");
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
    if (l.dbId) await fetch(`/api/elements/${l.dbId}`, { method: "DELETE" });
    drawnItems.removeLayer(l);
    omegaLayer.removeLayer(l);
  }
}

function resetModes() {
  currentMode = null;
  smartRoutePoints = [];
  [drawnItems, omegaLayer].forEach((lg) =>
    lg.eachLayer((g) => {
      if (g.routeLine?.editing) g.routeLine.editing.disable();
    }),
  );
  tempMarkers.forEach((m) => map.removeLayer(m));
  tempMarkers = [];
  if (previewLine) map.removeLayer(previewLine);
  if (eraserCircle) {
    map.removeLayer(eraserCircle);
    eraserCircle = null;
  }
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
  setStatus("Ir a TUBRICA: Haga clic en su origen");
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
    fillOpacity: 0.2,
  }).addTo(map);
};

map.on(L.Draw.Event.CREATED, (e) => {
  const n = prompt("Nombre:");
  if (n)
    saveElement(n, "route", e.layer.getLatLngs()).then((id) =>
      renderRoute(e.layer.getLatLngs(), n, id),
    );
});
document.getElementById("eraserSlider").oninput = (e) => {
  eraserSize = parseInt(e.target.value);
  if (eraserCircle) eraserCircle.setRadius(eraserSize);
};

async function finalizeSmart() {
  const coords = smartRoutePoints.map((p) => `${p.lng},${p.lat}`).join(";");
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
  );
  const data = await res.json();
  if (data.routes) {
    const pts = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
    const n = prompt("Nombre:");
    if (n) renderRoute(pts, n, await saveElement(n, "route", pts));
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
