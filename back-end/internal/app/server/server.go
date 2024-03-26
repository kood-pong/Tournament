package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"tournament/back-end/internal/store"
	"tournament/back-end/pkg/router"
)

const (
	sessionName     = "session"
	jwtKey          = "JWT_KEY"
	ctxKeyRequestID = iota
)

type ctxKey int

const ctxUserID ctxKey = 1

type server struct {
	router *router.Router
	store  store.Store
	logger *log.Logger
}

func newServer(store store.Store) *server {
	s := &server{
		router: router.New(),
		store:  store,
		logger: log.Default(),
	}

	s.configureRouter()

	return s
}

func (s *server) configureRouter() {
	//Middleware usage
	s.router.Use(s.CORSMiddleware, s.logRequest, s.setRequestID)
	s.router.UseWithPrefix("/jwt", s.jwtMiddleware)
	s.router.UseWithPrefix("/admin", s.adminMiddleware)
	//USERS
	s.router.POST("/api/v1/users/create", s.userCreate())
	s.router.POST("/api/v1/users/login", s.userLogin())
	s.router.GET("/api/v1/users/logout", s.userLogout())
	s.router.GET("/api/v1/auth/checkCookie", s.handlerCheckCookie())
	s.router.GET("/api/v1/users/all/{status}", s.userGetAll())
	s.router.GET("/api/v1/users/{id}", s.userGet())

	//<------------AUTH MIDDLEWARE REQUIRED-------------->
	//USERS
	s.router.GET("/api/v1/jwt/tournaments/register/{id}", s.tournamentRegister())
	s.router.GET("/api/v1/jwt/notifications/update/{id}", s.notificationUpdate())

	//<------------AUTH + ADMIN MIDDLEWARE REQUIRED-------------->
	//USERS
	s.router.PUT("/api/v1/jwt/admin/users/complete", s.userRegister())
	//TOURNAMENTS
	s.router.POST("/api/v1/jwt/admin/tournaments/create", s.tournamentCreate())
	s.router.PUT("/api/v1/jwt/admin/tournaments/update", s.tournamentUpdate())
	s.router.POST("/api/v1/jwt/admin/tournaments/start", s.tournamentStart())
	s.router.POST("/api/v1/jwt/admin/tournaments/generate", s.tournamentGenerate())
	s.router.PUT("/api/v1/jwt/admin/tournaments/match/update", s.matchUpdate())
	s.router.POST("/api/v1/jwt/admin/tournaments/set/create", s.setCreate())
	s.router.GET("/api/v1/jwt/admin/tournaments/leaderboard/{id}", s.tournamentLeaderboard())

}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

func (s *server) error(w http.ResponseWriter, code int, err error) {
	s.respond(w, code, map[string]string{"error": err.Error()})
}

func (s *server) respond(w http.ResponseWriter, code int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	if data != nil {
		json.NewEncoder(w).Encode(data)
	}
}

func (s *server) decode(r *http.Request, data interface{}) error {
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		return fmt.Errorf("decode json: %w", err)
	}
	return nil
}
