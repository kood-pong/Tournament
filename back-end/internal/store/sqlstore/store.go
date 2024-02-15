package sqlstore

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

type Store struct {
	Db *sql.DB
	// chatRepository     *ChatRepository
}

func New(db *sql.DB) *Store {
	return &Store{
		Db: db,
	}
}

// func (s *Store) Chat() store.ChatRepository {
// 	if s.chatRepository != nil {
// 		return s.chatRepository
// 	}

// 	s.chatRepository = &ChatRepository{
// 		store: s,
// 	}

// 	return s.chatRepository
// }
