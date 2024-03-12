package server

import (
	"encoding/json"
	"net/http"
	"tournament/back-end/internal/models"
)

func (s *server) setCreate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		set := &models.Set{}

		if err := json.NewDecoder(r.Body).Decode(set); err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}

		_, err := s.store.Set().Create(set)
		if err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully created the set",
			Data:    nil,
		})
	}
}
