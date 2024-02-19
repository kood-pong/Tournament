package sqlstore

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
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

	//Get all admin users
	admins, err := u.GetAllAdmins()
	if err != nil {
		fmt.Println("NOTIFICATION SYSTEM: Error with retrieving admins!", err)
		return nil
	}

	//Create notification for each of them
	for _, admin := range admins{
		err := u.store.Notification().Create(&models.Notification{
			UserID: admin.ID,
			Message: fmt.Sprintf("User %v registered and wants confirmation", user.Username),
		})
		if err != nil {
			fmt.Println("NOTIFICATION SYSTEM: Error with creating notification", err)
		}
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

func (u *UserRepository) GetAllAdmins() ([]models.User, error) {
	query := `SELECT id, email, username FROM users u WHERE u.role = 1`

	var users []models.User
	rows, err := u.store.Db.Query(query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Email, &user.Username); err != nil {
			return make([]models.User, 1), fmt.Errorf("failed to scan post row: %v", err)
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error reading posts rows: %v", err)
	}

	return users, nil
}

func (u *UserRepository) GetAll(status string) ([]models.User, error) {
	query := `SELECT id, email, username, first_name, last_name, points, wins, losses, ranking, status FROM users u WHERE u.status = ?`

	var users []models.User
	rows, err := u.store.Db.Query(query, strings.ToLower(status))
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

func (u *UserRepository) CompleteRegistration(user_id, status string) error {
	//Update the application to approved / rejected
	query := `UPDATE users SET status = ? WHERE id = ?`

	_, err := u.store.Db.Exec(query, status, user_id)
	if err != nil{
		return err
	}

	return nil
}

func (u *UserRepository) UpdatePoints(user_id string, points int) error {
	//Update the user overall points
	query := `UPDATE users SET points = points + ? WHERE id = ?`

	_, err := u.store.Db.Exec(query, points, user_id)
	if err != nil{
		return err
	}

	return nil
}

func (u *UserRepository) UpdateWins(user_id string, wins int) error {
	//Update the user overall points
	query := `UPDATE users SET wins = wins + ? WHERE id = ?`

	_, err := u.store.Db.Exec(query, wins, user_id)
	if err != nil{
		return err
	}

	return nil
}

func (u *UserRepository) UpdateLosses(user_id string, losses int) error {
	//Update the user overall points
	query := `UPDATE users SET losses = losses + ? WHERE id = ?`

	_, err := u.store.Db.Exec(query, losses, user_id)
	if err != nil{
		return err
	}

	return nil
}

func (u *UserRepository) UpdateRanking(user_id string, ranking int) error {
	//Update the user overall points
	query := `UPDATE users SET ranking = ranking + ? WHERE id = ?`

	_, err := u.store.Db.Exec(query, ranking, user_id)
	if err != nil{
		return err
	}

	return nil
}





