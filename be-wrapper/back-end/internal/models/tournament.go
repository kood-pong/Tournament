package models

type Tournament struct {
	ID         string `db:"id" json:"id"`
	Name       string `db:"name" json:"name" validate:"required|min_len:2|alphanumeric"`
	Start_date string `db:"start_date" json:"start_date" validate:"required"`
	End_date   string `db:"end_date" json:"end_date" validate:"required"`
	Type       string `db:"type" json:"type" validate:"required|alphanumeric|contains:elimination"`
	Status     string `db:"status" json:"status" validate:"required|contains:open,ongoing,finished"`
}

type TournamentWithWinner struct {
	Tournament
	Winner User `json:"winner"`
}
