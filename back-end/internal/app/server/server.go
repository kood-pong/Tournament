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
	ctxUserID
)

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
	//middlewares soon
	s.router.UseWithPrefix("/jwt", s.jwtMiddleware)
	//USER
	s.router.POST("/api/v1/users/create", s.handlerCreateUser())
	s.router.POST("/api/v1/users/login", s.handlerLoginUser())
	s.router.GET("/api/v1/users/logout", s.handlerLogOut())
	s.router.GET("/api/v1/auth/checkCookie", s.handlerCheckCookie())

	//<------------AUTH MIDDLEWARE REQUIRED-------------->
	s.router.GET("/api/v1/jwt/users", s.handlerGetAllUsers())
	s.router.GET("/api/v1/jwt/users/:id", s.handlerGetUser())
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
