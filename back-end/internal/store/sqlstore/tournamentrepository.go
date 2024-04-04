package sqlstore

import (
	"database/sql"
	"errors"
	"fmt"
	"math/rand"
	"tournament/back-end/internal/models"

	"github.com/google/uuid"
)

type TournamentRepository struct {
	store *Store
}

func (t *TournamentRepository) Create(tournament *models.Tournament) (*models.Tournament, error) {
	tournament.ID = uuid.New().String()

	query := `INSERT INTO tournaments (id, name, start_date, end_date, type) VALUES (?, ?, ?, ?, ?)`

	_, err := t.store.Db.Exec(query, tournament.ID, tournament.Name, tournament.Start_date, tournament.End_date, tournament.Type)

	if err != nil {
		return nil, err
	}

	return tournament, nil
}

func (t *TournamentRepository) Update(tournament *models.Tournament) (*models.Tournament, error) {
	query := `UPDATE tournaments SET name = ?, start_date = ?, end_date = ?, status = ?, type = ? WHERE id = ?`

	_, err := t.store.Db.Exec(query, tournament.Name, tournament.Start_date, tournament.End_date, tournament.Status, tournament.Type, tournament.ID)

	if err != nil {
		return nil, err
	}

	return tournament, nil

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

func (t *TournamentRepository) GetSetsToWin(tournament_id string) (int, error) {
	query := `SELECT sets_to_win FROM matches WHERE tournament_id = ? AND status = 'ongoing'`

	var setsToWin int
	if err := t.store.Db.QueryRow(query, tournament_id).Scan(&setsToWin); err != nil {
		return -1, err
	}

	return setsToWin, nil
}

func (t *TournamentRepository) GetAllByYear(year string) ([]models.TournamentWithWinner, error) {
	query := `SELECT * FROM tournaments WHERE strftime('%Y', start_date) = ?`
	rows, err := t.store.Db.Query(query, year)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tournaments []models.TournamentWithWinner
	for rows.Next() {
		var tournament models.TournamentWithWinner
		err := rows.Scan(&tournament.ID, &tournament.Name, &tournament.Start_date, &tournament.End_date, &tournament.Type, &tournament.Status)
		if err != nil {
			return nil, err
		}
		winner, err := t.store.Result().GetWinners(tournament.ID)
		if err != nil {
			return nil, err
		}
		if len(winner) == 1 {
			tournament.Winner = winner[0]
		}
		tournaments = append(tournaments, tournament)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tournaments, nil
}

func (t *TournamentRepository) Register(reg *models.Register) error {
	// Check if the user is already registered for the tournament
	checkQuery := `SELECT 1 FROM registration WHERE tournament_id = ? AND user_id = ? LIMIT 1`
	var existingRegistration int
	err := t.store.Db.QueryRow(checkQuery, reg.TournamentID, reg.UserID).Scan(&existingRegistration)

	if err == nil {
		return errors.New("user is already registered for the tournament")
	} else if err != sql.ErrNoRows {
		return err
	}
	//check if specific tournament exists
	tournament, err := t.Get(reg.TournamentID)
	if err != nil {
		return err
	}
	//check if status is open(users can register)
	if tournament.Status != "open" {
		return errors.New("registration is not open")
	}

	reg.ID = uuid.New().String()
	query := `INSERT INTO registration (id, tournament_id, user_id) VALUES (?, ?, ?)`

	_, err = t.store.Db.Exec(query, reg.ID, reg.TournamentID, reg.UserID)
	if err != nil {
		return err
	}

	return nil
}

func (t *TournamentRepository) CheckRegister(user_id, tournament_id string) (bool, error) {
	query := `SELECT * FROM registration WHERE user_id = ? AND tournament_id = ?`
	var registration models.Register
	err := t.store.Db.QueryRow(query, user_id, tournament_id).Scan(&registration.ID, &registration.TournamentID, &registration.UserID)
	if err != nil {
		return false, fmt.Errorf("error while getting registration: %v", err)
	}
	return true, nil
}

func (t *TournamentRepository) UnRegister(user_id, tournament_id string) error {
	//check tournament state
	tournament, err := t.Get(tournament_id)
	if err != nil {
		return err
	}
	if tournament.Status != "open" {
		return errors.New("can not unregister anymore")
	}

	query := `DELETE FROM registration WHERE user_id = ? AND tournament_id = ?`

	rows, err := t.store.Db.Exec(query, user_id, tournament_id)
	if err != nil {
		return err
	}
	aff, err := rows.RowsAffected()
	if err != nil {
		return err
	}
	if aff == 0 {
		return errors.New("nothing was deleted")
	}

	return nil
}

func (t *TournamentRepository) GetAllOngoing(state string) ([]models.Tournament, error) {
	query := `SELECT * FROM tournaments WHERE status = ?`

	rows, err := t.store.Db.Query(query, state)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tournaments []models.Tournament
	for rows.Next() {
		var tournament models.Tournament
		err := rows.Scan(&tournament.ID, &tournament.Name, &tournament.Start_date, &tournament.End_date, &tournament.Type, &tournament.Status)
		if err != nil {
			return nil, err
		}
		tournaments = append(tournaments, tournament)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tournaments, nil
}

func (t *TournamentRepository) GetUserParticipatedTournaments(user_id string) ([]models.TournamentWithWinner, error) {
	query := `SELECT t.id, t.name, t.start_date, t.end_date, t.type, t.status FROM registration r JOIN tournaments t ON t.id = r.tournament_id WHERE user_id = ?`

	rows, err := t.store.Db.Query(query, user_id)
	if err != nil {
		return nil, fmt.Errorf("error executing db query: %v", err)
	}
	defer rows.Close()

	var tournaments []models.TournamentWithWinner

	for rows.Next() {
		var tournament models.TournamentWithWinner

		if err := rows.Scan(&tournament.ID, &tournament.Name, &tournament.Start_date, &tournament.End_date, &tournament.Type, &tournament.Status); err != nil {
			return nil, fmt.Errorf("error scanning rows: %v", err)
		}

		winner, err := t.store.Result().GetWinners(tournament.ID)
		if err != nil {
			return nil, err
		}
		if len(winner) == 1 {
			tournament.Winner = winner[0]
		}
		tournaments = append(tournaments, tournament)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error retrieving rows: %v", err)
	}

	return tournaments, nil
}

func (t *TournamentRepository) GetParticipants(tournament_id string) ([]models.User, error) {
	query := `SELECT r.user_id, u.username, u.email, u.first_name, u.last_name, u.points, u.wins, u.losses, u.ranking 
		FROM registration r
		JOIN users u ON r.user_id = u.id
		WHERE r.tournament_id = ?`

	rows, err := t.store.Db.Query(query, tournament_id)
	if err != nil {
		return nil, fmt.Errorf("error executing db query: %v", err)
	}
	defer rows.Close()

	var userList []models.User

	for rows.Next() {
		var user models.User

		if err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.FirstName, &user.LastName, &user.Points, &user.Wins, &user.Losses, &user.Ranking); err != nil {
			return nil, fmt.Errorf("error scanning rows: %v", err)
		}

		userList = append(userList, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error retrieving rows: %v", err)
	}

	return userList, nil
}

func (t *TournamentRepository) GetLeaderboard(tournament_id string) ([]models.User, error) {
	//check tournament status leaderboard will only be generated, if tournament is finished
	tournament, err := t.Get(tournament_id)

	if err != nil {
		return nil, err
	}
	if tournament.Status != "finished" {
		return nil, fmt.Errorf("tournament is not finished - state %v", tournament.Status)
	}

	query := `SELECT
    	u.id,
    	u.username,
		u.email,
		u.first_name,
		u.last_name,
		u.points,
		u.wins,
		u.losses,
		u.ranking,
    	SUM(CASE WHEN r.loser_id = u.id THEN 1 ELSE 0 END) AS losses,
    	SUM(CASE WHEN r.winner_id = u.id THEN 1 ELSE 0 END) AS wins,
		COALESCE(SUM(CASE WHEN r.winner_id = u.id THEN r.points ELSE 0 END), 0) AS total_points
	FROM
    	tournaments t
	LEFT JOIN 
    	matches m ON t.id = m.tournament_id
	LEFT JOIN 
    	results r ON m.id = r.match_id
	LEFT JOIN
    	users u ON u.id = r.winner_id OR u.id = r.loser_id
	LEFT JOIN 
    	users ul ON ul.id = r.loser_id
	WHERE 
    	m.tournament_id = ? 
	GROUP BY
    	u.id,
    	u.username
	ORDER BY
    	wins DESC, total_points DESC, losses ASC;
`

	rows, err := t.store.Db.Query(query, tournament_id)
	if err != nil {
		return nil, fmt.Errorf("error executing db query: %v", err)
	}
	defer rows.Close()

	var userList []models.User

	for rows.Next() {
		var user models.User
		var points int

		if err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.FirstName, &user.LastName, &user.Points, &user.Wins, &user.Losses, &user.Ranking, &user.TournamentLosses, &user.TournamentWins, &points); err != nil {
			return nil, fmt.Errorf("error scanning rows: %v", err)
		}

		userList = append(userList, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error retrieving rows: %v", err)
	}

	return userList, nil
}

func (t *TournamentRepository) Start(tournament_id string, numberOfSets int) ([]models.Match, error) {
	tournament, err := t.Get(tournament_id)
	if err != nil {
		return nil, err
	}

	if tournament.Status != "open" {
		return nil, fmt.Errorf("tournament is %v", tournament.Status)
	}

	//get all participants
	participants, err := t.GetParticipants(tournament_id)
	if err != nil {
		return nil, err
	}

	//check length of the player (MIN - 4 PLAYERS)
	if len(participants) < 4 {
		return nil, fmt.Errorf("not enough players to start the tournament")
	}

	//actually start the tournament
	tournament.Status = "ongoing"
	_, err = t.Update(tournament)
	if err != nil {
		return nil, err
	}

	//generate matches
	matches, err := t.GenerateMatches(participants, tournament_id, numberOfSets)
	if err != nil {
		return nil, err
	}

	return matches, nil
}

func (t *TournamentRepository) GenerateMatches(participants []models.User, tournament_id string, numberOfSets int) ([]models.Match, error) {
	//shuffle players
	shuffledParticipants := shuffle(participants)
	//Get how many matches we need to generate
	matchNumber := calcMatches(len(participants))

	var currentRound int
	matchNumbers := []int{1, 2, 4, 8, 16, 32, 64, 128, 256}
	for i, num := range matchNumbers {
		if num == matchNumber {
			currentRound = len(matchNumbers) - (i + 1)
			break
		}
	}

	var matches []models.Match
	for i := 0; i < matchNumber; i++ {
		//fill up the first half
		if i < matchNumber/2 {
			matches = append(matches, models.Match{
				TournamentID: tournament_id,
				Player1:      shuffledParticipants[i].ID,
				Player2:      "byebye",
				SetsToWin:    numberOfSets,
				Status:       "ongoing",
				CurrentRound: currentRound,
			})
		} else {
			if i >= len(shuffledParticipants) {
				break
			}
			matches[(matchNumber/2)-(matchNumber-i)].Player2 = shuffledParticipants[i].ID
		}
	}

	//return with actual ID
	var returnMatches []models.Match
	//Add matches to db
	for _, m := range matches {
		match, err := t.store.Match().Create(m)
		if err != nil {
			return nil, err
		}
		returnMatches = append(returnMatches, *match)
	}

	return returnMatches, nil
}

func (t *TournamentRepository) Generate(tournament_id string, numberOfSets int) ([]models.Match, error) {
	tournament, err := t.Get(tournament_id)
	if err != nil {
		return nil, err
	}
	if tournament.Status != "ongoing" {
		return nil, fmt.Errorf("tournament is %v", tournament.Status)
	}

	//Check if there are ongoing matches
	matches, err := t.store.Match().FindOngoing(tournament_id)
	if err != nil {
		return nil, err
	}
	if len(matches) > 0 {
		return matches, nil
	}
	//Find all the players who are still on tournament
	winners, err := t.store.Result().GetWinners(tournament_id)
	if err != nil {
		return nil, err
	}
	if len(winners) == 1 {
		//finish tournament
		tournament.Status = "finished"
		_, err = t.Update(tournament)
		if err != nil {
			return nil, err
		}
		return nil, nil
	}
	//check if its finale
	var finaleRound []models.Match
	if len(winners) <= 2 {
		//it should generate matches for 3rd and 4th place also
		//query information for 3rd and 4th
		customWinners, err := t.store.Result().GetFinalists(tournament_id)
		if err != nil {
			return nil, err
		}

		finaleRound, err = t.GenerateMatches(customWinners, tournament_id, numberOfSets)
		if err != nil {
			return nil, err
		}
	}

	matches, err = t.GenerateMatches(winners, tournament_id, numberOfSets)
	if err != nil {
		return nil, err
	}

	//check if there is anything to append to finalist (for finale round only)
	if len(finaleRound) != 0 {
		matches = append(matches, finaleRound...)
	}

	return matches, nil
}

// helpers for generating a dynamic tournaments
func calcMatches(participants int) int {
	matchNumbers := []int{2, 4, 8, 16, 32, 64, 128, 256}
	for _, num := range matchNumbers {
		if num >= participants {
			return num
		}
	}
	return 0
}

func shuffle(participants []models.User) []models.User {
	shuffled := make([]models.User, len(participants))
	perm := rand.Perm(len(participants))
	for i, v := range perm {
		shuffled[v] = participants[i]
	}
	return shuffled
}

//start tournament
//1. status = ongoing
//2. find number of matches to begin with (read from registration table)
//3. generate matches accordingly

//check tournament state
//1. Check tournament state --> if its going start the tournament
//	if its finished --> return
//	if its going
//		1.1 check if there is ongoing matches, if there are, display all of them
//		1.2 if not generate new matches
//			1.1.1 Add sets accordingly
//		1.3 Add results
