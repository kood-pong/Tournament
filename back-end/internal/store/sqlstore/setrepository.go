package sqlstore

import (
	"tournament/back-end/internal/models"

	"github.com/google/uuid"
)

type SetRepository struct {
	store *Store
}

func (m *SetRepository) Create(set *models.Set) (*models.Set, error) {
	set.ID = uuid.New().String()

	query := `INSERT INTO sets (id, set_number, match_id, player_1_score, player_2_score) VALUES (?, ?, ?, ?, ?)`

	_, err := m.store.Db.Exec(query, set.ID, set.SetNumber, set.MatchID, set.Player1_Score, set.Player2_Score)
	
	if err != nil {
		return nil, err
	}
	return set, nil
}
