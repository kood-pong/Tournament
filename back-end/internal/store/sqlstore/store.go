package sqlstore

import (
	"database/sql"
	"reflect"
	"tournament/back-end/internal/store"

	_ "github.com/mattn/go-sqlite3"
)

type Store struct {
	Db                   *sql.DB
	userRepository       *UserRepository
	tournamentRepository *TournamentRepository
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

func (s *Store) Tournament() store.TournamentRepository {
	if s.tournamentRepository != nil {
		return s.tournamentRepository
	}

	s.tournamentRepository = &TournamentRepository{
		store: s,
	}

	return s.tournamentRepository
}

func hasStructEmptyValues(s interface{}) bool {
	val := reflect.ValueOf(s).Elem() 
	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		zeroValue := reflect.Zero(field.Type())
		if reflect.DeepEqual(field.Interface(), zeroValue.Interface()) {
			return true
		}
	}
	return false
}
