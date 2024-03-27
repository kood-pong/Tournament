package server

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"tournament/back-end/internal/store/sqlstore"
	"tournament/back-end/pkg/router"

	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
)

func Start(config *Config) error {
	db, err := newDB(config.DatabaseURL, config.DatabaseSchema)
	if err != nil {
		return err
	}

	defer db.Close()

	store := sqlstore.New(db)

	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Content-Length", "Authorization"},
		AllowCredentials: true,
	})

	router := router.New()

	newHttpSrv := &http.Server{
		Addr: ":7080",
		Handler: corsMiddleware.Handler(router),
	}
	srv := newServer(store, newHttpSrv, router)

	return srv.Server.ListenAndServe()
}

func newDB(databaseURL, dataBaseSchema string) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", databaseURL)
	if err != nil {
		return nil, err
	}

	sqlStmt, err := os.ReadFile(dataBaseSchema)
	if err != nil {
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	_, err = db.Exec(string(sqlStmt))
	if err != nil {
		log.Fatal(err)
	}

	return db, nil
}
