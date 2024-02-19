package sqlstore

import (
	"database/sql"
	"fmt"
	"tournament/back-end/internal/models"

	"github.com/google/uuid"
)

type NotificationRepository struct {
	store *Store
}

func (n *NotificationRepository) Create(notification *models.Notification) error {
	notification.ID = uuid.New().String()
	notification.Status = "unread"

	query := `INSERT INTO notification (id, user_id, message, status) VALUES (?, ?, ?, ?)`

	res, err := n.store.Db.Exec(query, notification.ID, notification.UserID, notification.Message, notification.Status)

	// fmt.Println("res", res, "Created a notification", notification)
	if err != nil {
		return err
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected != 1 {
		return fmt.Errorf("expected 1 row to be affected, got %d", rowsAffected)
	}
	return nil
}

func (n *NotificationRepository) Get(notification_id string) (*models.Notification, error) {
	notification := &models.Notification{}
	query := `SELECT * FROM notification WHERE id = ?`

	err := n.store.Db.QueryRow(query, notification_id).Scan(
		&notification.ID,
		&notification.UserID,
		&notification.Message,
		&notification.Status,
		&notification.Timestamp,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no notification found with id: %s", notification_id)
		}
		return nil, fmt.Errorf("error while scanning row: %v", err)
	}

	return notification, nil
}

func (n *NotificationRepository) GetForUser(user_id string) (*[]models.Notification, error) {
	query := `SELECT id, user_id, message, status, timestamp FROM notification WHERE user_id = ? AND status = "unread"`

	rows, err := n.store.Db.Query(query, user_id)
	if err != nil {
		return nil, fmt.Errorf("error executing db query: %v", err)
	}
	defer rows.Close()

	var notifications []models.Notification

	for rows.Next() {
		var notification models.Notification
		if err := rows.Scan(&notification.ID, &notification.UserID, &notification.Message, &notification.Status, &notification.Timestamp); err != nil {
			return nil, fmt.Errorf("error scanning rows: %v", err)
		}
		notifications = append(notifications, notification)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error retrieving rows: %v", err)
	}

	return &notifications, nil
}

func (n *NotificationRepository) Update(notification *models.Notification, user_id string) error {
	query := `UPDATE notification SET status = ? WHERE id = ? AND user_id = ?`

	result, err := n.store.Db.Exec(query, notification.Status, notification.ID, user_id)

	if err != nil {
		return err
	}

	if rowsAffected, err := result.RowsAffected(); err != nil {
		// Handle the error
		return fmt.Errorf("error getting rows affected: %v", err)
	} else if rowsAffected != 1 {
		return fmt.Errorf("no notification to be read with id: %v", notification.ID)
	}

	return nil

}
