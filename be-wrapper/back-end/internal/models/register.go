package models

type Register struct {
	ID           string `db:"id" json:"id"`
	TournamentID string `db:"tournament_id" json:"tournament_id" validate:"required"`
	UserID       string `db:"user_id" json:"user_id" validate:"required"`
}
