package store

import "tournament/back-end/internal/models"

type UserRepository interface {
	FindByID(id string) (*models.User, error)
	Create(user *models.User) error
	Check(login string) (*models.User, error)
	GetAll(status string) ([]models.User, error)
	CompleteRegistration(user_id, status string) error
	UpdatePoints(user_id string, points int) error
	UpdateWins(user_id string, wins int) error
	UpdateLosses(user_id string, losses int) error
	UpdateRanking(user_id string, ranking int) error
}

type TournamentRepository interface {
	Create(tournament *models.Tournament) (*models.Tournament, error)
	Update(tournament *models.Tournament) (*models.Tournament, error)
	Get(tournament_id string) (*models.Tournament, error)
	Register(reg *models.Register) error
	GetLeaderboard(tournament_id string) ([]models.User, error)
	Start(tournament_id string, numberOfSets int) ([]models.Match, error)
	GetParticipants(tournament_id string) ([]models.User, error)
	GenerateMatches(participants []models.User, tournament_id string, numberOfSets int) ([]models.Match, error)
	GetAllByYear(year string) ([]models.TournamentWithWinner, error)
	Generate(tournament_id string, numberOfSets int) ([]models.Match, error)
	GetUserParticipatedTournaments(user_id string) ([]models.TournamentWithWinner, error)
	GetAllOngoing(state string) ([]models.Tournament, error)
	CheckRegister(user_id, tournament_id string) (bool, error)
	UnRegister(user_id, tournament_id string) error
	GetSetsToWin(tournament_id string) (int, error)
}

type NotificationRepository interface {
	Create(notification *models.Notification) error
	GetForUser(user_id string) (*[]models.Notification, error)
	Get(notification_id string) (*models.Notification, error)
	Update(notification *models.Notification, user_id string) error
}

type MatchRepository interface {
	Create(match models.Match) (*models.Match, error)
	FindOngoing(tournament_id string) ([]models.Match, error)
	UpdateStatus(match models.Match) error
	Get(match_id string) (*models.Match, error)
}

type SetRepository interface {
	Create(set *models.Set) (*models.Set, error)
	DetermineWinner(match_id string) error
}

type ResultRepository interface {
	Create(result *models.Result) error
	GetWinners(tournament_id string) ([]models.User, error)
	MaxWins(tournament_id string) (int, error)
	UserLosses(user_id, tournament_id string) (int, error)
	GetFinalists(tournament_id string) ([]models.User, error)
}

type ImageRepository interface {
	Create(image models.Image) (*models.Image, error)
	GetAll(tournament_id string) ([]models.Image, error)
}
