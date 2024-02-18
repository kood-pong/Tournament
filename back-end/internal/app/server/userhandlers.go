package server

import (
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"time"
	"tournament/back-end/internal/models"
	"tournament/back-end/pkg/jwttoken"
	"tournament/back-end/pkg/router"
)

func (s *server) handlerCreateUser() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := &models.User{}
		if err := json.NewDecoder(r.Body).Decode(user); err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		if err := s.store.User().Create(user); err != nil {
			s.error(w, r, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, r, http.StatusCreated, Response{
			Message: "Successfully created user!",
			Data:    user,
		})
	}
}

func (s *server) handlerGetAllUsers() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		data, err := s.store.User().GetAllOtherUsers()
		if err != nil {
			s.error(w, r, http.StatusInternalServerError, err)
			return
		}

		s.respond(w, r, http.StatusOK, Response{
			Message: "Successfully retrieved all users!",
			Data:    data,
		})
	}
}

func (s *server) handlerLogOut() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		deletedCookie := s.deleteCookie()
		http.SetCookie(w, &deletedCookie)
		s.respond(w, r, http.StatusOK, Response{Message: "Successfully logged out"})
	}
}

func (s *server) handlerLoginUser() http.HandlerFunc {
	type RequestBody struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		var requestBody RequestBody
		if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		user, err := s.store.User().Check(requestBody.Email)
		if err != nil || !user.ComparePassword(requestBody.Password) {
			s.error(w, r, http.StatusUnauthorized, errors.New("invalid login credentials"))
			return
		}

		expiration := time.Now().Add(5 * time.Hour)
		alg := jwttoken.HmacSha256(os.Getenv(jwtKey))
		claims := jwttoken.NewClaims(user.ID, expiration.Unix())
		token, err := alg.Encode(claims)
		if err != nil {
			s.error(w, r, http.StatusInternalServerError, err)
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
		s.respond(w, r, http.StatusOK, Response{
			Message: "Successfully logged in!",
			Data:    user,
		})
	}
}

func (s *server) handlerCheckCookie() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(sessionName)
		if err != nil {
			s.error(w, r, http.StatusUnauthorized, err)
			return
		}

		alg := jwttoken.HmacSha256(os.Getenv(jwtKey))
		claims, err := alg.DecodeAndValidate(cookie.Value)
		if err != nil {
			s.error(w, r, http.StatusUnauthorized, err)
			return
		}
		// check if user exist
		_, err = s.store.User().FindByID(claims.UserID)
		if err != nil {
			deletedCookie := s.deleteCookie()
			http.SetCookie(w, &deletedCookie)
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		s.respond(w, r, http.StatusOK, Response{
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

func (s *server) handlerGetUser() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// get id from cookie
		id := router.Param(r.Context(), "id")

		if id == "" {
			id = r.Context().Value(ctxUserID).(string)
		}
		user, err := s.store.User().FindByID(id)
		if err != nil {
			s.error(w, r, http.StatusBadRequest, err)
			return
		}

		s.respond(w, r, http.StatusOK, Response{
			Message: "Successfully got user!",
			Data:    user,
		})
	}
}
