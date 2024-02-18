package sqlstore

import (
	"database/sql"
	"errors"
	"fmt"
	"tournament/back-end/internal/models"

	"github.com/google/uuid"
)

type UserRepository struct {
	store *Store
}

func (u *UserRepository) FindByID(id string) (*models.User, error) {
	// command to find a user with a specific id
	query := `SELECT * FROM users u WHERE u.id = ?`

	var user models.User
	// get the row and add it to the user variable
	err := u.store.Db.QueryRow(query, id).Scan(&user.ID, &user.Email, &user.Username, &user.Password, &user.FirstName, &user.LastName, &user.Points, &user.Wins, &user.Losses, &user.Ranking, &user.Status, &user.Role)
	if err != nil {
		return nil, err
	}

	user.Sanitize()
	return &user, nil
}

func (u *UserRepository) Create(user *models.User) error {
	user.ID = uuid.New().String()
	// hash the password and store it
	user.BeforeCreate()

	// Adding that stuff to db
	query := `INSERT INTO users (id, username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)`

	_, err := u.store.Db.Exec(query, user.ID, user.Username, user.Email, user.Password, user.FirstName, user.LastName)
	user.Sanitize()

	if err != nil {
		return err
	}

	return nil
}

func (u *UserRepository) Check(login string) (*models.User, error) {
	// command to find a user no matter if its email or username
	query := `SELECT * FROM users u WHERE u.email = ? OR u.username = ?`
	var user models.User

	err := u.store.Db.QueryRow(query, login, login).Scan(&user.ID, &user.Email, &user.Username, &user.Password, &user.FirstName, &user.LastName, &user.Points, &user.Wins, &user.Losses, &user.Ranking, &user.Status, &user.Role)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, err
		}
	}
	// check if passwords match
	return &user, nil
}

func (r *UserRepository) GetAllOtherUsers() ([]models.User, error) {
	query := `SELECT id, email, username, first_name, last_name, points, wins, losses, ranking, status FROM users`

	var users []models.User
	rows, err := r.store.Db.Query(query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Email, &user.Username, &user.FirstName, &user.LastName, &user.Points, &user.Wins, &user.Losses, &user.Ranking, &user.Status); err != nil {
			return make([]models.User, 1), fmt.Errorf("failed to scan post row: %v", err)
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error reading posts rows: %v", err)
	}

	return users, nil
}
