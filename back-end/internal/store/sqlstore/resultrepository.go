package sqlstore

import (
	"fmt"
	"tournament/back-end/internal/models"

	"github.com/google/uuid"
)

type ResultRepository struct {
	store *Store
}

func (r *ResultRepository) Create(result *models.Result) error {
	//Check if the result is already added
	// checkQuery := `SELECT 1 FROM results WHERE match_id = ? AND winner_id = ? AND loser_id = ? LIMIT 1`
	// var existingRegistration int

	// err := r.store.Db.QueryRow(checkQuery, result.MatchID, result.WinnerID, result.LoserID).Scan(&existingRegistration)

	// if err == nil {
	// 	return fmt.Errorf("user is already registered for the tournament")
	// } else if err != sql.ErrNoRows {
	// 	return err
	// }

	result.ID = uuid.New().String()

	query := `INSERT INTO results (id, match_id, winner_id, loser_id) VALUES (?, ?, ?, ?)`

	res, err := r.store.Db.Exec(query, result.ID, result.MatchID, result.WinnerID, result.LoserID)

	if err != nil {
		return err
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected != 1 {
		return fmt.Errorf("expected 1 row to be affected, got %d", rowsAffected)
	}
	return nil
}

func (r *ResultRepository) GetWinners() ([]models.User, error) {
	//Find max wins
	countQuery := `
        SELECT COUNT(id) AS wins_count
        FROM results
        GROUP BY winner_id
        ORDER BY COUNT(id) DESC
        LIMIT 1;
    `
	var maxWinsCount int
	if err := r.store.Db.QueryRow(countQuery).Scan(&maxWinsCount); err != nil {
		return nil, err
	}

	//Get all the users who have won the max amount
	query := `
    	SELECT winner_id
    	FROM results
    	GROUP BY winner_id
    	HAVING COUNT(id) = ?
	`
	var users []models.User

	rows, err := r.store.Db.Query(query, maxWinsCount)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user_id string
		if err := rows.Scan(&user_id); err != nil {
			return nil, err
		}
		user, err := r.store.User().FindByID(user_id)
		if err != nil {
			return nil, err
		}
		users = append(users, *user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}
