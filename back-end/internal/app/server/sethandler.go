package server

import (
	"errors"
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

		t, err := s.store.Set().Exists(*set)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if t {
			s.error(w, http.StatusUnprocessableEntity, errors.New("can not create the same set twice"))
			return
		}

		currSetNumber, err := s.store.Set().CurrentSets(*set)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		match, err := s.store.Match().Get(set.MatchID)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if (match.SetsToWin*2)-1 <= currSetNumber {
			s.error(w, http.StatusUnprocessableEntity, errors.New("set limit reached"))
			return
		}

		createdSet, err := s.store.Set().Create(set)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := s.store.Match().UpdateStatus(models.Match{
			ID:     set.MatchID,
			Status: "completed",
		}); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}
		// if err := s.store.Match().UpdateStatus(models.Match{
		// 	ID: set.MatchID,
		// 	Status: "finished",
		// }); err != nil {
		// 	s.error(w, http.StatusUnprocessableEntity, err)
		// 	return
		// }

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully created set",
			Data:    createdSet,
		})
	}
}

func (s *server) updateSet() http.HandlerFunc {
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

		updatedSet, err := s.store.Set().Update(*set)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully updated set",
			Data:    updatedSet,
		})
	}
}
