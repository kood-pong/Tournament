package models

type Tournament struct {
	ID         string `db:"id" json:"id"`
	Name       string `db:"name" json:"name"`
	Start_date string `db:"start_date" json:"start_date"`
	End_date   string `db:"end_date" json:"end_date"`
	Type       string `db:"type" json:"type"`
	Status     string `db:"status" json:"status"`
}
