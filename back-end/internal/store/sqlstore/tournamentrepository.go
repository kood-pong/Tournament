package sqlstore

import (
	"database/sql"
	"fmt"
	"tournament/back-end/internal/models"

	"github.com/google/uuid"
)

type TournamentRepository struct {
	store *Store
}

func (t *TournamentRepository) Create(tournament *models.Tournament) error {
	tournament.ID = uuid.New().String()

	query := `INSERT INTO tournaments (id, name, start_date, end_date, type) VALUES (?, ?, ?, ?, ?)`

	_, err := t.store.Db.Exec(query, tournament.ID, tournament.Name, tournament.Start_date, tournament.End_date, tournament.Type)

	if err != nil {
		return err
	}

	return nil
}

func (t *TournamentRepository) Update(tournament *models.Tournament) error {
	query := `UPDATE tournaments SET name = ?, start_date = ?, end_date = ?, type = ? WHERE id = ?`

	if hasStructEmptyValues(tournament) {
		return fmt.Errorf("NO EMPTY FIELDS")
	}

	_, err := t.store.Db.Exec(query, tournament.Name, tournament.Start_date, tournament.End_date, tournament.Type, tournament.ID)

	if err != nil {
		return err
	}

	return nil

}

func (t *TournamentRepository) Get(tournament_id string) (*models.Tournament, error) {
	tournament := &models.Tournament{}
	query := `SELECT * FROM tournaments WHERE id = ?`

	err := t.store.Db.QueryRow(query, tournament_id).Scan(
		&tournament.ID,
		&tournament.Name,
		&tournament.Start_date,
		&tournament.End_date,
		&tournament.Type,
		&tournament.Status,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no tournament found with id: %s", tournament_id)
		}
		return nil, fmt.Errorf("error while scanning row: %v", err)
	}

	return tournament, nil
}

func (t *TournamentRepository) Register(reg *models.Register) error {
	reg.ID = uuid.New().String()

	query := `INSERT INTO registration (id, tournament_id, user_id) VALUES (?, ?, ?)`

	//check if specific tournament exists
	_, err := t.Get(reg.TournamentID)
	if err != nil {
		return err
	}

	_, err = t.store.Db.Exec(query, reg.ID, reg.TournamentID, reg.UserID)
	if err != nil{
		return err
	}

	return nil
}
