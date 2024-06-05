package models

type Notification struct {
	ID        string `db:"id" json:"id"`
	UserID    string `db:"user_id" json:"user_id" validate:"required"`
	Message   string `db:"message" json:"message" validate:"required"`
	Status    string `db:"status" json:"status" validate:"required"`
	Timestamp string `db:"timestamp" json:"timestamp"`
}
