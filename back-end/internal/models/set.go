package models

type Set struct {
	ID            string `db:"id" json:"id"`
	MatchID       string `db:"match_id" json:"match_id"`
	SetNumber     int    `db:"set_number" json:"set_number" validate:"required"`
	Player1_Score int `db:"player_1_score" json:"player_1_score" validate:"required"`
	Player2_Score int `db:"player_2_score" json:"player_2_score" validate:"required"`
}
