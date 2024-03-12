package server

import (
	"encoding/json"
	"net/http"
	"tournament/back-end/internal/models"
)

type RequestBody struct {
	TournamentID string `json:"tournament_id"`
	NumberOfSets int    `json:"sets_to_win"`
}

func (s *server) tournamentCreate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var response *models.Tournament

		if err := json.NewDecoder(r.Body).Decode(&response); err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}

		if err := s.store.Tournament().Create(response); err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}
		s.respond(w, http.StatusOK, Response{
			Message: "Successfully created tournament!",
			Data:    nil,
		})
	}
}

func (s *server) tournamentUpdate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var response *models.Tournament

		if err := json.NewDecoder(r.Body).Decode(&response); err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}
		if err := s.store.Tournament().Update(response); err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully updated tournament!",
			Data:    nil,
		})
	}
}

func (s *server) tournamentRegister() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tournament_id := r.PathValue("id")
		userId := r.Context().Value(ctxUserID).(string)

		if err := s.store.Tournament().Register(&models.Register{TournamentID: tournament_id, UserID: userId}); err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "User successfully registered!",
			Data:    nil,
		})
	}
}

func (s *server) tournamentStart() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request RequestBody

		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}

		matches, err := s.store.Tournament().Start(request.TournamentID, request.NumberOfSets)

		if err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}
		s.respond(w, http.StatusOK, Response{
			Message: "Tournament started successfully",
			Data:    matches,
		})
	}
}

func (s *server) tournamentGenerate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request RequestBody

		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}

		matches, err := s.store.Tournament().Generate(request.TournamentID, request.NumberOfSets)

		if matches == nil && err == nil {
			s.respond(w, http.StatusOK, Response{
				Message: "We have a winner, closing a tournament",
				Data:    nil,
			})
			return
		}

		if err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}
		s.respond(w, http.StatusOK, Response{
			Message: "Successfully generated new matches",
			Data:    matches,
		})
	}
}

func (s *server) tournamentLeaderboard() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tournament_id := r.PathValue("id")

		userList, err := s.store.Tournament().GetLeaderboard(tournament_id)
		if err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully retrieved leaderboard",
			Data:    userList,
		})

	}
}
