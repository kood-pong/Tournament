package sqlstore

import (
	"database/sql"
	"tournament/back-end/internal/store"

	_ "github.com/mattn/go-sqlite3"
)

type Store struct {
	Db             *sql.DB
	userRepository *UserRepository
}

func New(db *sql.DB) *Store {
	return &Store{
		Db: db,
	}
}

func (s *Store) User() store.UserRepository {
	if s.userRepository != nil {
		return s.userRepository
	}

	s.userRepository = &UserRepository{
		store: s,
	}

	return s.userRepository
}
