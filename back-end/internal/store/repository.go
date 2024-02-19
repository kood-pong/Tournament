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
	Create(tournament *models.Tournament) error
	Update(tournament *models.Tournament) error
	Get(tournament_id string) (*models.Tournament, error)
	Register(reg *models.Register) error
}
