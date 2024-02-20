package server

import (
	"encoding/json"
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
	logger *log.Logger
	store  store.Store
}

func newServer(store store.Store) *server {
	s := &server{
		router: router.NewRouter(),
		logger: log.Default(),
		store:  store,
	}

	s.configureRouter()

	return s
}

func (s *server) configureRouter() {
	//Middleware usage
	s.router.Use(s.CORSMiddleware)
	s.router.UseWithPrefix("/jwt", s.jwtMiddleware)
	s.router.UseWithPrefix("/admin", s.adminMiddleware)
	//USERS
	s.router.POST("/api/v1/users/create", s.handlerCreateUser())
	s.router.POST("/api/v1/users/login", s.handlerLoginUser())
	s.router.GET("/api/v1/users/logout", s.handlerLogOut())
	s.router.GET("/api/v1/auth/checkCookie", s.handlerCheckCookie())
	s.router.GET("/api/v1/users/all/:status", s.handlerGetAllUsers())
	s.router.GET("/api/v1/users/:id", s.handlerGetUser())

	//<------------AUTH MIDDLEWARE REQUIRED-------------->
	//USERS
	s.router.GET("/api/v1/jwt/tournaments/register/:id", s.handlerTournamentRegistration())
	s.router.GET("/api/v1/jwt/notifications/update/:id", s.handlerNotificationUpdate())

	//<------------AUTH + ADMIN MIDDLEWARE REQUIRED-------------->
	//USERS
	s.router.PUT("/api/v1/jwt/admin/users/complete", s.handlerCompleteRegistration())
	//TOURNAMENTS
	s.router.POST("/api/v1/jwt/admin/tournaments/create", s.handlerCreateTournament())
	s.router.PUT("/api/v1/jwt/admin/tournaments/update", s.handlerUpdateTournament())
	s.router.GET("/api/v1/jwt/admin/tournaments/start/:id", s.handlerStartTournament())
	s.router.GET("/api/v1/jwt/admin/tournaments/generate/:id", s.handlerGenerateTournament())

}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

func (s *server) error(w http.ResponseWriter, r *http.Request, code int, err error) {
	s.respond(w, r, code, map[string]string{"error": err.Error()})
}

func (s *server) respond(w http.ResponseWriter, r *http.Request, code int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	if data != nil {
		json.NewEncoder(w).Encode(data)
	}
}
