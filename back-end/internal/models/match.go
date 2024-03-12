package models

type Match struct {
	ID           string `db:"id" json:"id"`
	TournamentID string `db:"tournament_id" json:"tournament_id" validate:"required"`
	Player1      string `db:"player_1" json:"player_1" validate:"required"`
	Player2      string `db:"player_2" json:"player_2" validate:"required"`
	SetsToWin    int    `db:"sets_to_win" json:"sets_to_win"`
	Status       string `db:"status" json:"status" validate:"required|contains:ongoing,finished"`
}
