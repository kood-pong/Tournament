package server

import (
	"net/http"
	"tournament/back-end/internal/models"
	"tournament/back-end/pkg/validator"
)

func (s *server) matchUpdate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		match := &models.Match{}

		if err := s.decode(r, &match); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(match); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		err := s.store.Match().UpdateStatus(*match)
		if err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully updated the match",
			Data:    nil,
		})
	}
}

func (s *server) matchGet() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		match_id := r.PathValue("id")

		m, err := s.store.Match().Get(match_id)
		if err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully retrieved a match",
			Data: m,
		})
	}
}
