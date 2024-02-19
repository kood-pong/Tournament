package server

import (
	"encoding/json"
	"net/http"
	"tournament/back-end/internal/models"
	"tournament/back-end/pkg/router"
)

func (s *server) handlerCreateTournament() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var response *models.Tournament

		if err := json.NewDecoder(r.Body).Decode(&response); err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		if err := s.store.Tournament().Create(response); err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}
		s.respond(w, r, http.StatusOK, Response{
			Message: "Successfully created tournament!",
			Data:    nil,
		})
	}
}

func (s *server) handlerUpdateTournament() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var response *models.Tournament

		if err := json.NewDecoder(r.Body).Decode(&response); err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}
		if err := s.store.Tournament().Update(response); err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		s.respond(w, r, http.StatusOK, Response{
			Message: "Successfully updated tournament!",
			Data:    nil,
		})
	}
}

func (s *server) handlerTournamentRegistration() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tournament_id := router.Param(r.Context(), "id")
		userId := r.Context().Value(ctxUserID).(string)

		if err := s.store.Tournament().Register(&models.Register{TournamentID: tournament_id, UserID: userId}); err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		s.respond(w, r, http.StatusOK, Response{
			Message: "User successfully registered!",
			Data:    nil,
		})
	}
}
