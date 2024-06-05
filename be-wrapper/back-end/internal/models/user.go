package models

import (
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID               string          `db:"id" json:"id"`
	Email            string          `db:"email" json:"email" validate:"required|email"`
	Username         string          `db:"username" json:"username" validate:"required|alphanumeric|min_len:2"`
	Password         string          `db:"password" json:"password" validate:"required|min_len:8"`
	FirstName        string          `db:"first_name" json:"first_name" validate:"required|alpha"`
	LastName         string          `db:"last_name" json:"last_name" validate:"required|alpha"`
	Points           int             `db:"points" json:"points"`
	Wins             int             `db:"wins" json:"wins"`
	Losses           int             `db:"losses" json:"losses"`
	Ranking          int             `db:"ranking" json:"ranking"`
	Status           string          `db:"status" json:"status"`
	Role             int             `db:"role" json:"role"`
	Notifications    *[]Notification `json:"notifications"`
	TournamentWins   int             `json:"tournament_wins"`
	TournamentLosses int             `json:"tournament_losses"`
}

func (u *User) Sanitize() {
	u.Password = ""
}

func (u *User) ComparePassword(password string) bool {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password)) == nil
}

func encryptString(str string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(str), bcrypt.MinCost)
	if err != nil {
		return "", err
	}

	return string(b), nil
}

func (u *User) BeforeCreate() error {
	if len(u.Password) > 0 {
		enc, err := encryptString(u.Password)
		if err != nil {
			return err
		}
		u.Password = enc
	}

	return nil
}
