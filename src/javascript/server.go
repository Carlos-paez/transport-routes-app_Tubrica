package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	_ "modernc.org/sqlite" // Driver Pure Go (sin CGO)
)

const PORT = 3006

var db *sql.DB

type Element struct {
	ID         int         `json:"id"`
	Name       string      `json:"name"`
	Type       string      `json:"type"`
	Geometry   interface{} `json:"geometry"`
	Color      *string     `json:"color"`
	Passengers int         `json:"passengers"`
	CreatedAt  string      `json:"created_at"`
}

func main() {
	var err error
	db, err = sql.Open("sqlite", "routes.db")
	if err != nil {
		log.Fatalf("❌ Error al conectar SQLite: %v", err)
	}
	defer db.Close()

	// Crear tabla si no existe
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS elements (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		type TEXT NOT NULL,
		geometry TEXT NOT NULL,
		color TEXT,
		passengers INTEGER DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		log.Fatal(err)
	}

	// Añadir columna passengers si no existe (ignoramos error si ya existe)
	_, _ = db.Exec("ALTER TABLE elements ADD COLUMN passengers INTEGER DEFAULT 0")

	log.Println("✅ SQLite Conectado correctamente (Pure Go)")
	log.Println("✅ Columna 'passengers' verificada/añadida")

	// Servidor HTTP
	mux := http.NewServeMux()

	// Archivos estáticos + anti-caché para desarrollo
	fileServer := http.FileServer(http.Dir("."))
	mux.Handle("/", cacheControl(fileServer))

	// Rutas API
	mux.HandleFunc("/api/elements", elementsHandler)
	mux.HandleFunc("/api/elements/", elementsHandler)

	log.Printf("\n🚀 Servidor TUBRICA (Go - Pure Go) corriendo en: http://localhost:%d", PORT)
	log.Printf("💡 Caché deshabilitada + Driver sin CGO")

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", PORT), mux))
}

// Middleware anti-caché
func cacheControl(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" ||
			strings.HasSuffix(r.URL.Path, ".html") ||
			strings.HasSuffix(r.URL.Path, ".css") ||
			strings.HasSuffix(r.URL.Path, ".js") {
			w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
			w.Header().Set("Pragma", "no-cache")
			w.Header().Set("Expires", "0")
		}
		next.ServeHTTP(w, r)
	})
}

func elementsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		getElements(w, r)
	case http.MethodPost:
		createElement(w, r)
	case http.MethodPut:
		updateElement(w, r)
	case http.MethodDelete:
		deleteElement(w, r)
	default:
		http.Error(w, `{"error":"Método no permitido"}`, http.StatusMethodNotAllowed)
	}
}

func getElements(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name, type, geometry, color, passengers, created_at FROM elements")
	if err != nil {
		jsonError(w, err.Error(), 500)
		return
	}
	defer rows.Close()

	var elements []Element
	for rows.Next() {
		var e Element
		var geomStr string
		var colorStr sql.NullString

		err = rows.Scan(&e.ID, &e.Name, &e.Type, &geomStr, &colorStr, &e.Passengers, &e.CreatedAt)
		if err != nil {
			continue
		}
		if colorStr.Valid {
			e.Color = &colorStr.String
		}
		json.Unmarshal([]byte(geomStr), &e.Geometry)
		elements = append(elements, e)
	}
	json.NewEncoder(w).Encode(elements)
}

func createElement(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name       string      `json:"name"`
		Type       string      `json:"type"`
		Geometry   interface{} `json:"geometry"`
		Color      *string     `json:"color"`
		Passengers int         `json:"passengers"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "JSON inválido", 400)
		return
	}

	if req.Name == "" || req.Type == "" || req.Geometry == nil {
		jsonError(w, "Datos incompletos: name, type y geometry son obligatorios", 400)
		return
	}

	geomBytes, _ := json.Marshal(req.Geometry)

	_, err := db.Exec(
		"INSERT INTO elements (name, type, geometry, color, passengers) VALUES (?, ?, ?, ?, ?)",
		req.Name, req.Type, string(geomBytes), req.Color, req.Passengers,
	)
	if err != nil {
		jsonError(w, err.Error(), 500)
		return
	}

	var id int
	db.QueryRow("SELECT last_insert_rowid()").Scan(&id)

	json.NewEncoder(w).Encode(map[string]interface{}{"id": id, "status": "created"})
}

func updateElement(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/elements/")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		jsonError(w, "ID inválido", 400)
		return
	}

	var req struct {
		Geometry   interface{} `json:"geometry"`
		Color      *string     `json:"color"`
		Passengers int         `json:"passengers"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "JSON inválido", 400)
		return
	}

	if req.Geometry == nil {
		jsonError(w, "geometry es requerido", 400)
		return
	}

	geomBytes, _ := json.Marshal(req.Geometry)

	_, err = db.Exec(
		"UPDATE elements SET geometry = ?, color = ?, passengers = ? WHERE id = ?",
		string(geomBytes), req.Color, req.Passengers, id,
	)
	if err != nil {
		jsonError(w, err.Error(), 500)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
}

func deleteElement(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/elements/")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		jsonError(w, "ID inválido", 400)
		return
	}

	_, err = db.Exec("DELETE FROM elements WHERE id = ?", id)
	if err != nil {
		jsonError(w, err.Error(), 500)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}

func jsonError(w http.ResponseWriter, msg string, code int) {
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
