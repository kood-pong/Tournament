package server

import (
	"net/http"
	"tournament/back-end/internal/models"
	"tournament/back-end/pkg/validator"
)

type RequestBody struct {
	TournamentID string `json:"tournament_id" validate:"required"`
	NumberOfSets int    `json:"sets_to_win" validate:"required"`
}

func (s *server) tournamentCreate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var response *models.Tournament

		if err := s.decode(r, &response); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(response); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := s.store.Tournament().Create(response); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
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

		if err := s.decode(r, &response); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(response); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := s.store.Tournament().Update(response); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
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
			s.error(w, http.StatusUnprocessableEntity, err)
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

		if err := s.decode(r, &request); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(request); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		matches, err := s.store.Tournament().Start(request.TournamentID, request.NumberOfSets)

		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
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

		if err := s.decode(r, &request); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(request); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
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
			s.error(w, http.StatusUnprocessableEntity, err)
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
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully retrieved leaderboard",
			Data:    userList,
		})

	}
}
