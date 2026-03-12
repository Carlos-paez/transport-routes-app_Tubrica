package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

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

	db.Exec("PRAGMA journal_mode = WAL")

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS elements (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		type TEXT,
		geometry TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`)

	r := gin.Default()

	api := r.Group("/api")
	{
		api.GET("/elements", func(c *gin.Context) {
			rows, _ := db.Query("SELECT id, name, type, geometry, created_at FROM elements")
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
		})

		api.POST("/elements", func(c *gin.Context) {
			var in Element
			c.ShouldBindJSON(&in)
			res, _ := db.Exec("INSERT INTO elements (name, type, geometry) VALUES (?, ?, ?)", in.Name, in.Type, string(in.Geometry))
			id, _ := res.LastInsertId()
			c.JSON(200, gin.H{"id": id})
		})

		api.PUT("/elements/:id", func(c *gin.Context) {
			var in Element
			c.ShouldBindJSON(&in)
			db.Exec("UPDATE elements SET geometry = ? WHERE id = ?", string(in.Geometry), c.Param("id"))
			c.JSON(200, gin.H{"status": "ok"})
		})

		api.DELETE("/elements/:id", func(c *gin.Context) {
			db.Exec("DELETE FROM elements WHERE id = ?", c.Param("id"))
			c.JSON(200, gin.H{"status": "ok"})
		})
	}

	r.StaticFile("/", "./index.html")
	r.StaticFile("/app.js", "./app.js")
	r.StaticFile("/styles.css", "./styles.css")

	fmt.Println("🚀 Servidor TUBRICA en http://localhost:3000")
	r.Run(":3000")
}