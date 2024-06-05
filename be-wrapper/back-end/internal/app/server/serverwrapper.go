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

func Start() error {
	//create database
	db, err := newDB("./internal/db/database.db", "./internal/db/schema.sql")
	if err != nil {
		return err
	}
	defer db.Close()

	store := sqlstore.New(db)

	//create CORS middleware
	corsMiddleware := cors.New(cors.Options{
		AllowOriginRequestFunc: func(r *http.Request, origin string) bool {
			return true
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Content-Length", "Authorization"},
		AllowCredentials: true,
	})

	//create router
	router := router.New()

	//new http.server with corsmiddleware
	newHttpSrv := &http.Server{
		// Addr:    ":443",
		Addr: ":7080",
		Handler: corsMiddleware.Handler(router),
	}
	srv := newServer(store, newHttpSrv, router)

	return srv.Server.ListenAndServe()
	// return srv.Server.ListenAndServeTLS("tls/cert.pem", "tls/key.pem")

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
