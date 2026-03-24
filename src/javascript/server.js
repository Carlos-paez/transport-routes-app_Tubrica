const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware para parsear JSON con mejor manejo de errores
app.use(express.json({ limit: "2mb" }));

// 🔥 DESACTIVAR CACHÉ (para desarrollo)
app.use((req, res, next) => {
  if (
    req.url === "/" ||
    req.url.endsWith(".html") ||
    req.url.endsWith(".css") ||
    req.url.endsWith(".js")
  ) {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});

app.use(express.static(path.join(__dirname)));

// ==================== BASE DE DATOS ====================
const db = new sqlite3.Database("routes.db", (err) => {
  if (err) console.error("Error DB:", err);
  else console.log("✅ SQLite Conectado");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS elements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    geometry TEXT,
    color TEXT,
    passengers INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(
    "ALTER TABLE elements ADD COLUMN passengers INTEGER DEFAULT 0",
    () => {},
  );
});

// ==================== RUTAS API ====================

// GET - Obtener todos los elementos
app.get("/api/elements", (req, res) => {
  db.all("SELECT * FROM elements", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const parsedRows = rows.map((row) => ({
      ...row,
      geometry:
        typeof row.geometry === "string"
          ? JSON.parse(row.geometry)
          : row.geometry,
    }));
    res.json(parsedRows);
  });
});

// POST - Crear nuevo elemento (PROTEGIDO contra body vacío)
app.post("/api/elements", (req, res) => {
  const { name, type, geometry, color, passengers } = req.body || {};

  // Validación importante
  if (!name || !type || !geometry) {
    return res.status(400).json({
      error: "Faltan datos obligatorios: name, type y geometry son requeridos",
    });
  }

  db.run(
    "INSERT INTO elements (name, type, geometry, color, passengers) VALUES (?, ?, ?, ?, ?)",
    [name, type, JSON.stringify(geometry), color || null, passengers || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, status: "ok" });
    },
  );
});

// PUT - Actualizar elemento
app.put("/api/elements/:id", (req, res) => {
  const { geometry, color, passengers } = req.body || {};
  const id = req.params.id;

  if (!geometry) {
    return res
      .status(400)
      .json({ error: "Se requiere geometry para actualizar" });
  }

  db.run(
    "UPDATE elements SET geometry = ?, color = ?, passengers = ? WHERE id = ?",
    [JSON.stringify(geometry), color || null, passengers || 0, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ status: "ok" });
    },
  );
});

// DELETE
app.delete("/api/elements/:id", (req, res) => {
  db.run("DELETE FROM elements WHERE id = ?", req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "ok" });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`💡 Caché deshabilitada + validaciones añadidas`);
});
