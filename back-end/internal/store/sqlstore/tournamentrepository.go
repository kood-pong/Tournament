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
	query := `UPDATE tournaments SET name = ?, start_date = ?, end_date = ?, status = ?, type = ? WHERE id = ?`

	_, err := t.store.Db.Exec(query, tournament.Name, tournament.Start_date, tournament.End_date, tournament.Status, tournament.Type, tournament.ID)

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
	//check if user is already registered
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
    COUNT(DISTINCT w.id) AS wins,
    COUNT(DISTINCT l.id) AS losses
	FROM
    	users u
	LEFT JOIN
    	results w ON u.id = w.winner_id
	LEFT JOIN
    	results l ON u.id = l.loser_id
	JOIN
		matches m ON (w.match_id = m.id OR l.match_id = m.id)
	JOIN
		tournaments t ON m.tournament_id = t.id 
	WHERE
		t.id = ?
	GROUP BY
    	u.id,
    	u.username
	ORDER BY
    	wins DESC, losses ASC;`

	rows, err := t.store.Db.Query(query, tournament_id)
	if err != nil {
		return nil, fmt.Errorf("error executing db query: %v", err)
	}
	defer rows.Close()

	var userList []models.User

	for rows.Next() {
		var user models.User
		var wins, losses int

		if err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.FirstName, &user.LastName, &user.Points, &user.Wins, &user.Losses, &user.Ranking, &wins, &losses); err != nil {
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
	if err = t.Update(tournament); err != nil {
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
			})
		} else {
			if i >= len(shuffledParticipants) {
				break
			}
			fmt.Println("CHAINGING: ", (matchNumber/2)-(matchNumber-i))
			matches[(matchNumber/2)-(matchNumber-i)].Player2 = shuffledParticipants[i].ID
		}
	}

	//Add matches to db
	for _, m := range matches {
		if err := t.store.Match().Create(m); err != nil {
			return nil, err
		}
	}
	return matches, nil
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
	winners, err := t.store.Result().GetWinners()
	if err != nil {
		return nil, err
	}
	if len(winners) == 1 {
		//finish tournament
		tournament.Status = "finished"
		if err = t.Update(tournament); err != nil {
			return nil, err
		}
		return nil, nil
	}
	//check if its finale
	if len(winners) <= 2 {
		//it should generate matches for 3rd and 4th place also
		//query information for 3rd and 4th
		// finaleMatches, err := t.GenerateMatches()
		fmt.Println("IMPLEMENT FINALE!")
	}

	matches, err = t.GenerateMatches(winners, tournament_id, numberOfSets)
	if err != nil {
		return nil, err
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
