package server

import (
	"net/http"
	"tournament/back-end/internal/models"
	"tournament/back-end/pkg/validator"
)

func (s *server) setCreate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		set := &models.Set{}

		if err := s.decode(r, &set); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(set); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		_, err := s.store.Set().Create(set)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully created the set",
			Data:    nil,
		})
	}
}
