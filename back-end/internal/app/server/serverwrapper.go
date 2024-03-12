package server

import (
	"database/sql"
	"tournament/back-end/internal/store/sqlstore"
	"log"
	"net/http"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

func Start(config *Config) error {
	db, err := newDB(config.DatabaseURL, config.DatabaseSchema)
	if err != nil {
		return err
	}

	defer db.Close()

	store := sqlstore.New(db)
	srv := newServer(store)

	return http.ListenAndServe(config.Port, srv)
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
