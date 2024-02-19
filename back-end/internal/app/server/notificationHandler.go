package server

import (
	"net/http"
	"tournament/back-end/pkg/router"
)

func (s *server) handlerNotificationUpdate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := router.Param(r.Context(), "id")
		user_id := r.Context().Value(ctxUserID).(string)
		notification, err := s.store.Notification().Get(id)
		if err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}
		notification.Status = "read";

		err = s.store.Notification().Update(notification, user_id)
		if err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		s.respond(w, r, http.StatusOK, Response{
			Message: "Successfully read notification",
			Data:    nil,
		})
	}
}
