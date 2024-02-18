package store

import "tournament/back-end/internal/models"

type UserRepository interface {
	FindByID(id string) (*models.User, error)
	Create(user *models.User) error
	Check(login string) (*models.User, error)
	GetAllOtherUsers() ([]models.User, error)
}
