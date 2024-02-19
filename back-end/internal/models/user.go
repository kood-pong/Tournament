package models

import (
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID            string          `db:"id" json:"id"`
	Email         string          `db:"email" json:"email"`
	Username      string          `db:"username" json:"username"`
	Password      string          `db:"password" json:"password"`
	FirstName     string          `db:"first_name" json:"first_name"`
	LastName      string          `db:"last_name" json:"last_name"`
	Points        int             `db:"points" json:"points"`
	Wins          int             `db:"wins" json:"wins"`
	Losses        int             `db:"losses" json:"losses"`
	Ranking       int             `db:"ranking" json:"ranking"`
	Status        string          `db:"status" json:"status"`
	Role          int             `db:"role" json:"role"`
	Notifications *[]Notification `json:"notifications"`
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
