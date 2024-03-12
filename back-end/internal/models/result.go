package models

type Result struct {
	ID       string `db:"id" json:"id"`
	MatchID  string `db:"match_id" json:"match_id" validate:"required"`
	WinnerID string `db:"winner_id" json:"winner_id" validate:"required"`
	LoserID  string `db:"loser_id" json:"loser_id" validate:"required"`
}
