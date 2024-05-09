package sqlstore

import (
	"database/sql"
	"errors"
	"fmt"
	"tournament/back-end/internal/models"

	"github.com/google/uuid"
)

type SetRepository struct {
	store *Store
}

func (s *SetRepository) Create(set *models.Set) (*models.Set, error) {
	//If match id exists
	_, err := s.store.Match().Get(set.MatchID)
	if err != nil {
		return nil, fmt.Errorf("match with id %v does not exist", set.MatchID)
	}
	set.ID = uuid.New().String()

	query := `INSERT INTO sets (id, set_number, match_id, player_1_score, player_2_score) VALUES (?, ?, ?, ?, ?)`

	_, err = s.store.Db.Exec(query, set.ID, set.SetNumber, set.MatchID, set.Player1_Score, set.Player2_Score)

	if err != nil {
		return nil, err
	}

	//Update both player overall scores
	// var player1, player2 string
	// query = `SELECT player_1, player_2 FROM matches m WHERE m.id = ?`
	// if err = s.store.Db.QueryRow(query, set.MatchID).Scan(&player1, &player2); err != nil {
	// 	return nil, err
	// }

	// if err = s.store.User().UpdatePoints(player1, set.Player1_Score); err != nil {
	// 	return nil, err
	// }
	// if err = s.store.User().UpdatePoints(player2, set.Player2_Score); err != nil {
	// 	return nil, err
	// }

	// if err := s.DetermineWinner(set.MatchID); err != nil {
	// 	return nil, err
	// }

	return set, nil
}

func (s *SetRepository) DetermineWinner(match_id string) error {
	winnerID, loserID, err := s.GetWinnerAndLoserId(match_id)
	if err != nil {
		return nil
	}

	match, err := s.store.Match().Get(match_id)
	if err != nil {
		return err
	}

	//Calculate the weight/points accordingly
	//get current winner lose number
	loseCount, err := s.store.Result().UserLosses(winnerID, match.TournamentID)
	if err != nil {
		return err
	}

	//Adding the stuff to database
	result := &models.Result{
		MatchID:  match_id,
		WinnerID: winnerID,
		LoserID:  loserID,
		Points:   (match.CurrentRound * 1000) / (loseCount + 1),
	}
	err = s.store.Result().Create(result)
	if err != nil {
		return err
	}

	//ADD INFORMATION for user in overall db
	if err = s.store.User().UpdateWins(result.WinnerID, 1); err != nil {
		return err
	}
	if err = s.store.User().UpdateLosses(result.LoserID, 1); err != nil {
		return err
	}
	//Change rankinkg Winner gets 3 ranking points, loser gets only 1
	if err = s.store.User().UpdateRanking(result.WinnerID, 3); err != nil {
		return err
	}
	if err = s.store.User().UpdateRanking(result.LoserID, 1); err != nil {
		return err
	}
	//change match status
	if err := s.store.Match().UpdateStatus(models.Match{
		ID:     match_id,
		Status: "finished",
	}); err != nil {
		return err
	}
	return nil
}

func (s *SetRepository) Update(set models.Set) (*models.Set, error) {
	query := `UPDATE sets SET player_1_score = ?, player_2_score = ? WHERE id = ?`

	rows, err := s.store.Db.Exec(query, set.Player1_Score, set.Player2_Score, set.ID)
	if err != nil {
		return nil, err
	}

	affected, err := rows.RowsAffected()
	if err != nil {
		return nil, err
	}

	if affected == 0 {
		return nil, errors.New("nothing changed")
	}

	return &set, nil
}

func (s *SetRepository) Exists(set models.Set) (bool, error) {
	query := `SELECT COUNT(*) FROM sets WHERE match_id = ? AND set_number = ? AND player_1_score = ? AND player_2_score = ?`

	var count int
	err := s.store.Db.QueryRow(query, set.MatchID, set.SetNumber, set.Player1_Score, set.Player2_Score).Scan(&count)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		}
		return false, err
	}

	return count > 0, nil
}

func (s *SetRepository) CurrentSets(set models.Set) (int, error) {
	query := `SELECT COUNT(id) FROM sets WHERE match_id = ?`

	var sets int
	err := s.store.Db.QueryRow(query, set.MatchID, set.SetNumber).Scan(&sets)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		return -1, err
	}

	return sets, nil
}

func (s *SetRepository) GetWinnerAndLoserId(match_id string) (string, string, error) {
	query := `
	SELECT
		CASE
			WHEN SUM(CASE WHEN s.player_1_score > s.player_2_score THEN 1 ELSE 0 END) >= m.sets_to_win THEN m.player_1
			WHEN SUM(CASE WHEN s.player_2_score > s.player_1_score THEN 1 ELSE 0 END) >= m.sets_to_win THEN m.player_2
			ELSE NULL
		END AS winner_id,
		CASE
			WHEN SUM(CASE WHEN s.player_1_score > s.player_2_score THEN 1 ELSE 0 END) >= m.sets_to_win THEN m.player_2
			WHEN SUM(CASE WHEN s.player_2_score > s.player_1_score THEN 1 ELSE 0 END) >= m.sets_to_win THEN m.player_1
			ELSE NULL
		END AS loser_id
	FROM sets s
	JOIN matches m ON s.match_id = m.id
	WHERE m.id = ?;
	`

	var winnerID, loserID sql.NullString

	err := s.store.Db.QueryRow(query, match_id).Scan(&winnerID, &loserID)
	if err != nil {
		return winnerID.String, loserID.String, fmt.Errorf("error determining winner and loser: %v", err)
	}

	if !winnerID.Valid && !loserID.Valid {
		return winnerID.String, loserID.String ,errors.New("no winner or loser determined")
	}

	return winnerID.String, loserID.String, nil
}
