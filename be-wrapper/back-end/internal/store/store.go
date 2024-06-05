package store

type Store interface {
	User() UserRepository
	Tournament() TournamentRepository
	Notification() NotificationRepository
	Match() MatchRepository
	Set() SetRepository
	Result() ResultRepository
	Image() ImageRepository
}
