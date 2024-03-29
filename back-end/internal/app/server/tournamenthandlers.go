package server

import (
	"errors"
	"fmt"
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

		t, err := s.store.Tournament().Create(response)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}
		s.respond(w, http.StatusOK, Response{
			Message: "Successfully created tournament!",
			Data:    t,
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

		t, err := s.store.Tournament().Update(response)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully updated tournament!",
			Data:    t,
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
				Data:    true,
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

func (s *server) tournamentGet() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		year := r.PathValue("year")

		tournaments, err := s.store.Tournament().GetAllByYear(year)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: fmt.Sprintf("Successfully retrieved all tournaments for - %s year", year),
			Data:    tournaments,
		})
	}
}

func (s *server) getUserParticipatedTournaments() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user_id := r.Context().Value(ctxUserID).(string)

		if user_id == "" {
			s.error(w, http.StatusUnauthorized, errors.New("only for logged in users"))
			return
		}

		tournaments, err := s.store.Tournament().GetUserParticipatedTournaments(user_id)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully retrieved all user tournaments",
			Data:    tournaments,
		})
	}
}

func (s *server) tournamentGetOngoing() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		state := r.PathValue("state")
		if state != "ongoing" && state != "open" && state != "finished"{
			s.error(w, http.StatusBadRequest, errors.New("only open, ongoing allowed"))
			return
		}
		tournaments, err := s.store.Tournament().GetAllOngoing(state)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully retrieved all ongoing tournaments",
			Data: tournaments,
		})
	}
}
