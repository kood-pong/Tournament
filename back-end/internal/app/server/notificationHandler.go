package server

import (
	"net/http"
)

func (s *server) notificationUpdate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		user_id := r.Context().Value(ctxUserID).(string)
		notification, err := s.store.Notification().Get(id)
		if err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}
		notification.Status = "read"

		err = s.store.Notification().Update(notification, user_id)
		if err != nil {
			s.error(w, http.StatusBadRequest, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully read notification",
			Data:    nil,
		})
	}
}
