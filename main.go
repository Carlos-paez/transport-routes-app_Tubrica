package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	_ "github.com/glebarez/go-sqlite"
)

type Element struct {
	ID        int             `json:"id"`
	Name      string          `json:"name"`
	Type      string          `json:"type"`
	Geometry  json.RawMessage `json:"geometry"` 
	CreatedAt string          `json:"created_at"`
}

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("sqlite", "./routes.db")
	if err != nil {
		log.Fatal("❌ Error DB:", err)
	}
	defer db.Close()

	// Optimizaciones de escritura
	db.Exec("PRAGMA journal_mode = WAL")

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS elements (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		type TEXT,
		geometry TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`)

	r := gin.Default()

	// API
	api := r.Group("/api")
	{
		api.GET("/elements", getElements)
		api.POST("/elements", createElement)
		api.PUT("/elements/:id", updateElement)
		api.DELETE("/elements/:id", deleteElement)
	}

	// Frontend
	r.StaticFile("/", "./index.html")
	r.StaticFile("/app.js", "./app.js")
	r.StaticFile("/styles.css", "./styles.css")

	fmt.Println("\n🚀 SERVIDOR TUBRICA GO ACTIVO EN http://localhost:3000")
	r.Run(":3000")
}

func getElements(c *gin.Context) {
	rows, err := db.Query("SELECT id, name, type, geometry, created_at FROM elements")
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	elements := []Element{}
	for rows.Next() {
		var e Element
		var geoStr string
		rows.Scan(&e.ID, &e.Name, &e.Type, &geoStr, &e.CreatedAt)
		e.Geometry = json.RawMessage(geoStr)
		elements = append(elements, e)
	}
	c.JSON(200, elements)
}

func createElement(c *gin.Context) {
	var input Element
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Importante: Guardar el RawMessage como string plano
	res, err := db.Exec("INSERT INTO elements (name, type, geometry) VALUES (?, ?, ?)", 
		input.Name, input.Type, string(input.Geometry))
	
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	lastID, _ := res.LastInsertId()
	log.Printf("💾 Guardado: %s", input.Name)
	c.JSON(200, gin.H{"id": lastID})
}

func updateElement(c *gin.Context) {
	id := c.Param("id")
	var input Element
	c.ShouldBindJSON(&input)
	_, err := db.Exec("UPDATE elements SET geometry = ? WHERE id = ?", string(input.Geometry), id)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "ok"})
}

func deleteElement(c *gin.Context) {
	id := c.Param("id")
	db.Exec("DELETE FROM elements WHERE id = ?", id)
	log.Printf("🗑️ Eliminado ID: %s", id)
	c.JSON(200, gin.H{"status": "ok"})
}