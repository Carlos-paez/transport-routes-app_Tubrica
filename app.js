// ==========================================
// 1. CONFIGURACIÓN BASE Y MAPA
// ==========================================
const TUBRICA_LOCATION = L.latLng(10.09673945749423, -69.35846137671071);

// preferCanvas: false para permitir interacción con vértices de edición
const map = L.map("map", { 
    preferCanvas: false, 
    doubleClickZoom: false, 
    zoomControl: false 
}).setView(TUBRICA_LOCATION, 12);

L.control.zoom({ position: 'bottomright' }).addTo(map);

// crossOrigin: true para que html2canvas pueda capturar el mapa
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { 
    maxZoom: 19, crossOrigin: true 
}).addTo(map);

const boundaryLayer = L.layerGroup().addTo(map); 
const drawnItems = L.featureGroup().addTo(map);  

let currentMode = null;
let smartRoutePoints = [];
let tempMarkers = [];
let previewLine = null;
let eraserCircle = null;
let eraserSize = 30;

L.marker(TUBRICA_LOCATION, { interactive: false }).addTo(map).bindPopup("📍 SEDE TUBRICA").openPopup();

// --- MUNICIPIOS ---
async function cargarMunicipios() {
    const zonas = [
        { name: "Iribarren", id: 2211603, color: "#2980b9" },
        { name: "Palavecino", id: 2211604, color: "#27ae60" },
        { name: "P. Ayacucho", id: 7293700, color: "#c0392b" }
    ];
    zonas.forEach(z => {
        fetch(`https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=${z.id}&class=boundary&addressdetails=1&format=json&polygon_geojson=1`)
        .then(r => r.json()).then(data => {
            if (data.geometry) {
                L.geoJSON(data.geometry, { interactive: false, style: { color: z.color, weight: 3, opacity: 0.6, fillColor: z.color, fillOpacity: 0.1 } }).addTo(boundaryLayer);
                const center = L.geoJSON(data.geometry).getBounds().getCenter();
                L.marker(center, { 
                    icon: L.divIcon({ className: 'label-municipio', html: z.name }), interactive: false 
                }).addTo(boundaryLayer);
            }
        });
    });
}
cargarMunicipios();

// --- PERSISTENCIA (CARGA) ---
async function loadData() {
    try {
        const res = await fetch('/api/elements');
        const data = await res.json();
        data.forEach(el => {
            const geo = (typeof el.geometry === 'string') ? JSON.parse(el.geometry) : el.geometry;
            if (el.type === 'route') renderRoute(geo, el.name, el.id);
            else renderMarker(geo, el.name, el.id);
        });
    } catch (e) { console.error("Error cargando DB:", e); }
}
loadData();

// --- RENDERIZADO DE RUTAS ---
function renderRoute(latlngs, name, id) {
    if (!latlngs || latlngs.length < 2) return;
    const poly = L.polyline(latlngs, { color: "#3498db", weight: 6 });
    const start = L.circleMarker(latlngs[0], { radius: 5, color: '#2ecc71', fillColor: 'white', fillOpacity: 1 });
    const end = L.circleMarker(latlngs[latlngs.length-1], { radius: 5, color: '#e74c3c', fillColor: 'white', fillOpacity: 1 });
    const label = L.marker([0,0], { interactive: false, icon: L.divIcon({ className: "route-label", html: "" }) });

    const group = L.layerGroup([poly, label, start, end]);
    group.dbId = id; group.type = 'route'; group.name = name; group.routeLine = poly; group.isDirty = false;

    const update = (pts) => {
        let m = 0;
        for (let i = 1; i < pts.length; i++) m += map.distance(pts[i-1], pts[i]);
        const dist = (m/1000).toFixed(1);
        const time = Math.round(m / 11.11 / 60); 
        label.setLatLng(pts[Math.floor(pts.length/2)]);
        label.setIcon(L.divIcon({ className: "route-label", html: `<div class="route-text"><span class="route-name">${name}</span><span class="route-stats">${dist}km | ${time}m</span></div>` }));
        start.setLatLng(pts[0]); end.setLatLng(pts[pts.length-1]);
    };
    update(latlngs);

    [poly, start, end].forEach(l => l.on('click', e => {
        L.DomEvent.stopPropagation(e);
        if (currentMode === 'delete') handleDelete(group);
        else if (currentMode === 'edit') {
            if (poly.editing.enabled()) { poly.editing.disable(); saveLayer(group); }
            else poly.editing.enable();
        }
    }));

    poly.on('edit', () => { update(poly.getLatLngs()); group.isDirty = true; });
    group.addTo(drawnItems);
}

// ==========================================
// 5. HERRAMIENTAS DE TRAZADO (INTELIGENTE Y MANUAL)
// ==========================================

// Función para llamar a OSRM y guardar
async function procesarRutaOSRM(puntos) {
    const coords = puntos.map(p => `${p.lng},${p.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
            const pts = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            const name = prompt("Nombre de la ruta:");
            if (name) {
                const id = await saveElement(name, 'route', pts);
                renderRoute(pts, name, id);
            }
        }
    } catch (e) {
        alert("Error al obtener la ruta.");
    }
    resetModes();
}

// Manejador de clics en el mapa
map.on('click', e => {
    console.log("Clic en mapa. Modo actual:", currentMode);

    if (currentMode === 'marker') {
        const n = prompt("Nombre del marcador:");
        if (n) saveElement(n, 'marker', e.latlng).then(id => renderMarker(e.latlng, n, id));
    } 
    
    else if (currentMode === 'smart') {
        smartRoutePoints.push(e.latlng);
        
        // Marcador naranja visual
        const m = L.circleMarker(e.latlng, { radius: 8, color: '#e67e22', fillColor: 'white', fillOpacity: 1, interactive: true }).addTo(map);
        
        // Al hacer clic en un punto naranja, se finaliza la ruta
        m.on('click', ev => {
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
            const coordsPreview = smartRoutePoints.map(p => `${p.lng},${p.lat}`).join(';');
            fetch(`https://router.project-osrm.org/route/v1/driving/${coordsPreview}?overview=full&geometries=geojson`)
            .then(r => r.json()).then(data => {
                if (previewLine) map.removeLayer(previewLine);
                previewLine = L.polyline(data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]), { 
                    color: '#e67e22', weight: 4, dashArray: '5,10', interactive: false 
                }).addTo(map);
            });
        }
    } 
    
    else if (currentMode === 'to-tubrica') {
        procesarRutaOSRM([e.latlng, TUBRICA_LOCATION]);
    }
});

// ==========================================
// 6. FUNCIONES GLOBALES (PARA EL HTML)
// ==========================================

window.toggleSmartRoute = function() {
    resetModes();
    currentMode = 'smart';
    document.getElementById("status").innerText = "Modo: Ruta Inteligente (Marque puntos, clic en punto naranja para finalizar)";
};

window.enableManualDraw = function() {
    resetModes();
    currentMode = 'manual';
    const drawer = new L.Draw.Polyline(map, { shapeOptions: { color: '#3498db', weight: 6 } });
    drawer.enable();
};

window.toggleGoToTubrica = function() {
    resetModes();
    currentMode = 'to-tubrica';
    document.getElementById("status").innerText = "Modo: Ruta hacia Tubrica (Clic origen)";
};

window.enableMarker = function() {
    resetModes();
    currentMode = 'marker';
    document.getElementById("status").innerText = "Modo: Marcador";
};

window.enableEditMode = function() {
    resetModes();
    currentMode = 'edit';
    document.getElementById("status").innerText = "Modo: Edición (Clic en ruta)";
};

window.enableDelete = function() {
    resetModes();
    currentMode = 'delete';
    document.getElementById("status").innerText = "Modo: Eliminar (Clic en objeto)";
};

window.toggleEraser = function() {
    if (currentMode === 'eraser') return resetModes();
    resetModes();
    currentMode = 'eraser';
    eraserCircle = L.circle([0,0], { radius: eraserSize, color: "red", fillOpacity: 0.2, interactive: false }).addTo(map);
    map.getContainer().style.cursor = 'crosshair';
    document.getElementById("status").innerText = "Modo: Borrador";
};

// ==========================================
// 7. PERSISTENCIA (POST / PUT / DELETE)
// ==========================================

async function saveElement(n, t, g) {
    const res = await fetch('/api/elements', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: n, type: t, geometry: g }) 
    });
    const d = await res.json(); 
    return d.id;
}

async function saveLayer(l) {
    await fetch(`/api/elements/${l.dbId}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geometry: l.routeLine.getLatLngs() }) 
    });
    l.isDirty = false;
}

window.saveAllChanges = async function() {
    const promises = [];
    drawnItems.eachLayer(l => { if (l.isDirty) promises.push(saveLayer(l)); });
    await Promise.all(promises);
    alert("Cambios sincronizados.");
};

async function handleDelete(l) {
    if (confirm("¿Borrar permanentemente?")) {
        await fetch(`/api/elements/${l.dbId}`, { method: 'DELETE' });
        drawnItems.removeLayer(l);
    }
}

// ==========================================
// 8. UTILIDADES Y EVENTOS EXTRAS
// ==========================================

function resetModes() {
    currentMode = null;
    smartRoutePoints = [];
    drawnItems.eachLayer(g => { if(g.routeLine?.editing) g.routeLine.editing.disable(); });
    tempMarkers.forEach(m => map.removeLayer(m));
    tempMarkers = [];
    if (previewLine) map.removeLayer(previewLine);
    if (eraserCircle) map.removeLayer(eraserCircle);
    previewLine = null; eraserCircle = null;
    map.getContainer().style.cursor = '';
    document.getElementById("status").innerText = "Modo: Inactivo";
}

// Borrador dinámico
map.on('mousemove', e => {
    if (currentMode !== 'eraser' || !eraserCircle) return;
    eraserCircle.setLatLng(e.latlng);
    drawnItems.eachLayer(g => {
        if (g.type !== 'route') return;
        const pts = g.routeLine.getLatLngs();
        const filt = pts.filter(p => map.distance(p, e.latlng) > eraserSize);
        if (filt.length !== pts.length) {
            if (filt.length < 2) g.toDelete = true;
            else { g.routeLine.setLatLngs(filt); g.isDirty = true; g.routeLine.fire('edit'); }
        }
    });
});

map.on('mouseup', async () => {
    if (currentMode !== 'eraser') return;
    drawnItems.eachLayer(async g => {
        if (g.toDelete) { await fetch(`/api/elements/${g.dbId}`, { method: 'DELETE' }); drawnItems.removeLayer(g); }
        else if (g.isDirty) saveLayer(g);
    });
});

// Finalizar dibujo manual
map.on(L.Draw.Event.CREATED, e => {
    const n = prompt("Nombre de la ruta:");
    if (n) saveElement(n, 'route', e.layer.getLatLngs()).then(id => renderRoute(e.layer.getLatLngs(), n, id));
});

function renderMarker(latlng, name, id) {
    const m = L.marker(latlng).bindPopup(name); m.dbId = id;
    m.on('click', e => { L.DomEvent.stopPropagation(e); if (currentMode === 'delete') handleDelete(m); });
    m.addTo(drawnItems);
}

window.toggleSidebar = function() {
    document.getElementById("sidebar").classList.toggle("collapsed");
    setTimeout(() => map.invalidateSize(), 300);
};

window.exportMapToPDF = function() {
    html2canvas(document.getElementById("map"), { useCORS: true, scale: 2 }).then(canvas => {
        const pdf = new jspdf.jsPDF("l", "mm", "a4");
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 297, 210);
        pdf.save("mapa_tubrica.pdf");
    });
};

document.getElementById("eraserSlider").oninput = e => {
    eraserSize = parseInt(e.target.value);
    if (eraserCircle) eraserCircle.setRadius(eraserSize);
};