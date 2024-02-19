package store

type Store interface {
	User() UserRepository
	Tournament() TournamentRepository
}
