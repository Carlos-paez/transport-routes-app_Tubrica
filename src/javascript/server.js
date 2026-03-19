const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database("routes.db", (err) => {
  if (err) console.error("Error DB:", err);
  else {
    console.log("✅ SQLite Conectado");
    db.run("PRAGMA journal_mode = WAL"); // Optimización de velocidad
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

  // Asegurar que la columna 'passengers' exista en DBs antiguas
  db.run("ALTER TABLE elements ADD COLUMN passengers INTEGER DEFAULT 0", (err) => {
    if (!err) console.log("✅ Columna 'passengers' añadida.");
    // No lanzamos error si ya existe (err.message suele contener 'duplicate column name')
  });
});

// Obtener elementos
app.get("/api/elements", (req, res) => {
  db.all("SELECT * FROM elements", (err, rows) => {
    if (err) return res.status(500).json(err);
    // Parsear geometría para el frontend
    const parsedRows = rows.map(row => ({
      ...row,
      geometry: typeof row.geometry === "string" ? JSON.parse(row.geometry) : row.geometry
    }));
    res.json(parsedRows);
  });
});

// Guardar nuevo
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

// Actualizar (Borrador / Edición)
app.put("/api/elements/:id", (req, res) => {
  const { geometry, color, passengers } = req.body;
  
  if (color !== undefined && passengers !== undefined) {
    db.run(
      "UPDATE elements SET geometry = ?, color = ?, passengers = ? WHERE id = ?",
      [JSON.stringify(geometry), color, passengers, req.params.id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ status: "ok" });
      }
    );
  } else if (color !== undefined) {
    db.run(
      "UPDATE elements SET geometry = ?, color = ? WHERE id = ?",
      [JSON.stringify(geometry), color, req.params.id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ status: "ok" });
      }
    );
  } else {
    db.run(
      "UPDATE elements SET geometry = ? WHERE id = ?",
      [JSON.stringify(geometry), req.params.id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ status: "ok" });
      }
    );
  }
});

// Eliminar
app.delete("/api/elements/:id", (req, res) => {
  db.run("DELETE FROM elements WHERE id = ?", req.params.id, () =>
    res.json({ status: "ok" }),
  );
});

app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
