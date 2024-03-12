package sqlstore

import (
	"database/sql"
	"tournament/back-end/internal/store"

	_ "github.com/mattn/go-sqlite3"
)

type Store struct {
	Db                     *sql.DB
	userRepository         *UserRepository
	tournamentRepository   *TournamentRepository
	notificationRepository *NotificationRepository
	matchRepository        *MatchRepository
	setRepository          *SetRepository
	resultRepository       *ResultRepository
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

func (s *Store) Notification() store.NotificationRepository {
	if s.notificationRepository != nil {
		return s.notificationRepository
	}

	s.notificationRepository = &NotificationRepository{
		store: s,
	}

	return s.notificationRepository
}

func (s *Store) Match() store.MatchRepository {
	if s.matchRepository != nil {
		return s.matchRepository
	}

	s.matchRepository = &MatchRepository{
		store: s,
	}

	return s.matchRepository
}

func (s *Store) Set() store.SetRepository {
	if s.setRepository != nil {
		return s.setRepository
	}

	s.setRepository = &SetRepository{
		store: s,
	}

	return s.setRepository
}

func (s *Store) Result() store.ResultRepository {
	if s.resultRepository != nil {
		return s.resultRepository
	}

	s.resultRepository = &ResultRepository{
		store: s,
	}

	return s.resultRepository
}
