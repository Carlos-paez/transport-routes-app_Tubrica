const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// ==================== CACHE BUSTING AUTOMÁTICO ====================
// Genera un hash basado en la fecha de modificación del archivo
const getFileVersion = (filename) => {
  try {
    const filePath = path.join(__dirname, filename);
    const stats = fs.statSync(filePath);
    // Usamos los milisegundos del último cambio como versión
    return stats.mtime.getTime().toString(36); // versión corta y única
  } catch (err) {
    return Date.now().toString(36); // fallback
  }
};

// Middleware para desactivar caché en desarrollo + inyectar versión
app.use((req, res, next) => {
  if (req.url === "/" || req.url.endsWith(".html")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// ==================== RUTA ESPECIAL PARA HTML CON CACHE BUSTING ====================
app.get("/", (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

  const cssVersion = getFileVersion("styles.css");
  const jsVersion = getFileVersion("app.js");

  // Reemplaza las referencias con versión automática
  html = html.replace(
    /<link rel="stylesheet" href="styles\.css"(\s*[^>]*)>/i,
    `<link rel="stylesheet" href="styles.css?v=${cssVersion}"$1>`,
  );

  html = html.replace(
    /<script src="app\.js"(\s*[^>]*)><\/script>/i,
    `<script src="app.js?v=${jsVersion}"></script>`,
  );

  res.send(html);
});

// ==================== BASE DE DATOS (sin cambios) ====================
const db = new sqlite3.Database("routes.db", (err) => {
  if (err) console.error("Error DB:", err);
  else {
    console.log("✅ SQLite Conectado");
    db.run("PRAGMA journal_mode = WAL");
  }
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
    (err) => {
      if (!err) console.log("✅ Columna 'passengers' añadida (o ya existía)");
    },
  );
});

// ==================== RUTAS API (sin cambios) ====================
app.get("/api/elements", (req, res) => {
  db.all("SELECT * FROM elements", (err, rows) => {
    if (err) return res.status(500).json(err);
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

app.post("/api/elements", (req, res) => {
  const { name, type, geometry, color, passengers } = req.body;
  db.run(
    "INSERT INTO elements (name, type, geometry, color, passengers) VALUES (?, ?, ?, ?, ?)",
    [name, type, JSON.stringify(geometry), color || null, passengers || 0],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    },
  );
});

app.put("/api/elements/:id", (req, res) => {
  const { geometry, color, passengers } = req.body;
  let query = "UPDATE elements SET geometry = ?";
  const params = [JSON.stringify(geometry)];

  if (color !== undefined) {
    query += ", color = ?";
    params.push(color);
  }
  if (passengers !== undefined) {
    query += ", passengers = ?";
    params.push(passengers);
  }

  query += " WHERE id = ?";
  params.push(req.params.id);

  db.run(query, params, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ status: "ok" });
  });
});

app.delete("/api/elements/:id", (req, res) => {
  db.run("DELETE FROM elements WHERE id = ?", req.params.id, () =>
    res.json({ status: "ok" }),
  );
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔄 Cache-busting automático activado para styles.css y app.js`);
});
