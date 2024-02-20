package models

type Set struct {
	ID            string `db:"id" json:"id"`
	MatchID       string `db:"match_id" json:"match_id"`
	SetNumber     int    `db:"set_number" json:"set_number"`
	Player1_Score string `db:"player_1_score" json:"player_1_score"`
	Player2_Score string `db:"player_2_score" json:"player_2_score"`
}
