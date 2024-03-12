package sqlstore

import (
	"database/sql"
	"fmt"
	"tournament/back-end/internal/models"

	"github.com/google/uuid"
)

type MatchRepository struct {
	store *Store
}

func (m *MatchRepository) Create(match models.Match) error {
	match.ID = uuid.New().String()

	query := `INSERT INTO matches (id, tournament_id, player_1, player_2, sets_to_win, status) VALUES (?, ?, ?, ?, ?, ?)`

	_, err := m.store.Db.Exec(query, match.ID, match.TournamentID, match.Player1, match.Player2, match.SetsToWin, match.Status)

	if err != nil {
		return err
	}
	return nil
}

func (m *MatchRepository) FindOngoing(tournament_id string) ([]models.Match, error) {
	query := `SELECT * FROM matches as m WHERE tournament_id = ? AND status = "ongoing"`

	var matches []models.Match
	rows, err := m.store.Db.Query(query, tournament_id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var match models.Match
		if err := rows.Scan(&match.ID, &match.TournamentID, &match.Player1, &match.Player2, &match.SetsToWin, &match.Status); err != nil {
			return nil, fmt.Errorf("failed to scan match row: %v", err)
		}
		matches = append(matches, match)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error reading match rows: %v", err)
	}

	return matches, nil
}

func (m *MatchRepository) UpdateStatus(match models.Match) error {
	//check if match exists first of all
	_, err := m.store.Match().Get(match.ID)
	if err != nil {
		return err
	}

	//check if match is won by someone
	if err := m.store.Set().DetermineWinner(match.ID); err != nil {
		return err
	}

	query := `UPDATE matches SET status = ? WHERE id = ?`

	_, err = m.store.Db.Exec(query, match.Status, match.ID)
	if err != nil {
		return err
	}

	return nil
}

func (m *MatchRepository) Get(match_id string) (*models.Match, error) {
	match := &models.Match{}
	query := `SELECT id, tournament_id, player_1, player_2, sets_to_win, status FROM matches m WHERE m.id = ?`

	err := m.store.Db.QueryRow(query, match_id).Scan(
		&match.ID,
		&match.TournamentID,
		&match.Player1,
		&match.Player2,
		&match.SetsToWin,
		&match.Status,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no match found with id: %s", match_id)
		}
		return nil, fmt.Errorf("error while scanning row: %v", err)
	}

	return match, nil
}
