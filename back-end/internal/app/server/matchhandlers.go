package server

import (
	"encoding/json"
	"net/http"
	"tournament/back-end/internal/models"
)

func (s *server) handlerUpdateMatch() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		match := &models.Match{}

		if err := json.NewDecoder(r.Body).Decode(match); err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		err := s.store.Match().UpdateStatus(*match)
		if err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}
		_, err = s.store.Match().Get(match.ID)
		if err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		s.respond(w, r, http.StatusOK, Response{
			Message: "Successfully updated the match",
			Data:    nil,
		})
	}
}
