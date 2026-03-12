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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Obtener elementos
app.get("/api/elements", (req, res) => {
  db.all("SELECT * FROM elements", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Guardar nuevo
app.post("/api/elements", (req, res) => {
  const { name, type, geometry, color } = req.body;
  db.run(
    "INSERT INTO elements (name, type, geometry, color) VALUES (?, ?, ?, ?)",
    [name, type, JSON.stringify(geometry), color || null],
    function (err) {
      res.json({ id: this.lastID });
    },
  );
});

// Actualizar (Borrador)
app.put("/api/elements/:id", (req, res) => {
  const { geometry, color } = req.body;
  if (color) {
    db.run(
      "UPDATE elements SET geometry = ?, color = ? WHERE id = ?",
      [JSON.stringify(geometry), color, req.params.id],
      () => res.json({ status: "ok" }),
    );
  } else {
    db.run(
      "UPDATE elements SET geometry = ? WHERE id = ?",
      [JSON.stringify(geometry), req.params.id],
      () => res.json({ status: "ok" }),
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
