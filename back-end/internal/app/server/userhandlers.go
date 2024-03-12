package server

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"
	"tournament/back-end/internal/models"
	"tournament/back-end/pkg/jwttoken"
	"tournament/back-end/pkg/validator"
)

func (s *server) userCreate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := &models.User{}
		if err := s.decode(r, &user); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(user); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := s.store.User().Create(user); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusCreated, Response{
			Message: "Successfully created user!",
			Data:    user,
		})
	}
}

func (s *server) userGetAll() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		status := r.PathValue("status")
		if status != "approved" && status != "rejected" && status != "pending" {
			s.error(w, http.StatusUnprocessableEntity, errors.New("only approved, rejected, pending allowed"))
			return
		}

		data, err := s.store.User().GetAll(r.PathValue("status"))
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully retrieved all users!",
			Data:    data,
		})
	}
}

func (s *server) userLogout() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		deletedCookie := s.deleteCookie()
		http.SetCookie(w, &deletedCookie)
		s.respond(w, http.StatusOK, Response{Message: "Successfully logged out"})
	}
}

func (s *server) userLogin() http.HandlerFunc {
	type RequestBody struct {
		Email    string `json:"email" validate:"required|email"`
		Password string `json:"password" validate:"required|min_len:8"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		var requestBody RequestBody
		if err := s.decode(r, &requestBody); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(requestBody); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		user, err := s.store.User().Check(requestBody.Email)
		if err != nil {
			s.error(w, http.StatusUnauthorized, err)
			return
		}
		if !user.ComparePassword(requestBody.Password) {
			s.error(w, http.StatusUnauthorized, errors.New("incorrect password"))
			return
		}

		expiration := time.Now().Add(5 * time.Hour)
		alg := jwttoken.HmacSha256(os.Getenv(jwtKey))
		claims := jwttoken.NewClaims(user.ID, expiration.Unix())
		token, err := alg.Encode(claims)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		cookie := http.Cookie{
			Name:     sessionName,
			Value:    token,
			Expires:  expiration,
			Path:     "/",
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteNoneMode,
		}

		http.SetCookie(w, &cookie)

		user.Sanitize()
		s.respond(w, http.StatusOK, Response{
			Message: "Successfully logged in!",
			Data:    user,
		})
	}
}

func (s *server) handlerCheckCookie() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(sessionName)
		if err != nil {
			s.error(w, http.StatusUnauthorized, err)
			return
		}

		alg := jwttoken.HmacSha256(os.Getenv(jwtKey))
		claims, err := alg.DecodeAndValidate(cookie.Value)
		if err != nil {
			s.error(w, http.StatusUnauthorized, err)
			return
		}
		// check if user exist
		_, err = s.store.User().FindByID(claims.UserID)
		if err != nil {
			deletedCookie := s.deleteCookie()
			http.SetCookie(w, &deletedCookie)
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Cookie is present",
			Data:    claims.UserID,
		})
	}
}

func (s *server) deleteCookie() http.Cookie {
	deletedCookie := http.Cookie{
		Name:     sessionName,
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
	}
	return deletedCookie
}

func (s *server) userGet() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// get id from cookie
		id := r.PathValue("id")

		if id == "" {
			id = r.Context().Value(ctxUserID).(string)
		}
		user, err := s.store.User().FindByID(id)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		notifications, err := s.store.Notification().GetForUser(user.ID)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}
		user.Notifications = notifications

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully got user!",
			Data:    user,
		})
	}
}

func (s *server) userRegister() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type RequestBody struct {
			UserID string `json:"user_id" validate:"required"`
			Status string `json:"status" validate:"required|contains:approved,rejected"`
		}
		var requestBody RequestBody
		if err := s.decode(r, &requestBody); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(requestBody); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := s.store.User().CompleteRegistration(requestBody.UserID, requestBody.Status); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}
		s.respond(w, http.StatusOK, Response{
			Message: fmt.Sprintf(`User successfully %v`, requestBody.Status),
			Data:    nil,
		})
	}
}
