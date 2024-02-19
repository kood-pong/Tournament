package models


type Notification struct {
	ID        string `db:"id" json:"id"`
	UserID     string `db:"user_id" json:"user_id"`
	Message  string `db:"message" json:"message"`
	Status  string `db:"status" json:"status"`
	Timestamp string `db:"timestamp" json:"timestamp"`
}

