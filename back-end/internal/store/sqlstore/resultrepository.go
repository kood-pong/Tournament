package sqlstore

import (
	"database/sql"
	"fmt"
	"tournament/back-end/internal/models"

	"github.com/google/uuid"
)

type ResultRepository struct {
	store *Store
}

func (r *ResultRepository) Create(result *models.Result) error {
	result.ID = uuid.New().String()

	query := `INSERT INTO results (id, match_id, winner_id, loser_id, points) VALUES (?, ?, ?, ?, ?)`

	res, err := r.store.Db.Exec(query, result.ID, result.MatchID, result.WinnerID, result.LoserID, result.Points)

	if err != nil {
		return err
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected != 1 {
		return fmt.Errorf("expected 1 row to be affected, got %d", rowsAffected)
	}
	return nil
}

func (r *ResultRepository) GetWinners(tournament_id string) ([]models.User, error) {
	//Find max wins
	maxWinsCount, err := r.MaxWins(tournament_id)
	if err != nil {
		return nil, err
	}

	//Get all the users who have won the max amount
	query := `
		SELECT winner_id
		FROM results r
		JOIN matches m ON r.match_id = m.id
		WHERE m.tournament_id = ?
		GROUP BY winner_id
		HAVING COUNT(r.id) = ?
	`
	var users []models.User

	rows, err := r.store.Db.Query(query, tournament_id, maxWinsCount)
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

func (r *ResultRepository) MaxWins(tournament_id string) (int, error) {
	countQuery := `
		SELECT COUNT(r.id) AS wins_count
		FROM results r
		JOIN matches m ON r.match_id = m.id
		WHERE m.tournament_id = ?
		GROUP BY r.winner_id
		ORDER BY COUNT(r.id) DESC
		LIMIT 1;
    `
	var maxWinsCount int
	if err := r.store.Db.QueryRow(countQuery, tournament_id).Scan(&maxWinsCount); err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		} else {
			return -1, err
		}
	}

	return maxWinsCount, nil
}

func (r *ResultRepository) UserLosses(user_id, tournament_id string) (int, error) {
	var loseCount int
	err := r.store.Db.QueryRow(`
		SELECT COUNT(r.id) AS lose_count 
		FROM results r
		JOIN matches m ON r.match_id = m.id
		WHERE r.loser_id = ? 
			AND m.tournament_id = ?
		`, user_id, tournament_id).Scan(&loseCount)
	if err != nil {
		return 0, err
	}
	return loseCount, nil
}

func (r *ResultRepository) GetFinalists(tournament_id string) ([]models.User, error) {
	//Find max wins
	maxWinsCount, err := r.MaxWins(tournament_id)
	if err != nil {
		return nil, err
	}
	query := `
		SELECT loser_id AS loser
		FROM results r
		JOIN matches m ON r.match_id = m.id
		WHERE m.tournament_id = ? 
		GROUP BY loser_id
			HAVING COUNT(CASE WHEN r.loser_id = winner_id THEN 1 ELSE NULL END) = ? - 1
    		AND (SELECT COUNT(*) FROM results WHERE loser_id = loser AND match_id IN (SELECT id FROM matches WHERE tournament_id = ?)) = 1;`
	var users []models.User

	rows, err := r.store.Db.Query(query, tournament_id, maxWinsCount, tournament_id)
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
