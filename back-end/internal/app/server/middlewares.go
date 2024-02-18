package server

import (
	"context"
	"net/http"
	"os"
	"tournament/back-end/pkg/jwttoken"
)

// func (s *server) setRequestID(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		id := uuid.New().String()
// 		w.Header().Set("X-Request-ID", id)
// 		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), ctxKeyRequestID, id)))
// 	})
// }

// func (s *server) logRequest(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		rw := &responseWriter{w, http.StatusOK}
// 		if r.Method == http.MethodOptions {
// 			next.ServeHTTP(rw, r)
// 			return
// 		}

// 		s.logger.Printf("started %s %s ----- remote_addr:%s request_id:%s",
// 			r.Method,
// 			r.RequestURI,
// 			r.RemoteAddr,
// 			r.Context().Value(ctxKeyRequestID),
// 		)
// 		start := time.Now()
// 		next.ServeHTTP(rw, r)
// 		s.logger.Printf("completed in %s with %d %s ----- remote_addr:%s  request_id:%s",
// 			time.Now().Sub(start),
// 			rw.code,
// 			http.StatusText(rw.code),
// 			r.RemoteAddr,
// 			r.Context().Value(ctxKeyRequestID),
// 		)
// 	})
// }

func (s *server) jwtMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(sessionName)
		if err != nil {
			s.error(w, r, http.StatusUnauthorized, err)
			return
		}

		// Parse the token
		alg := jwttoken.HmacSha256(os.Getenv(jwtKey))
		claims, err := alg.DecodeAndValidate(cookie.Value)
		if err != nil {
			s.error(w, r, http.StatusUnauthorized, err)
			return
		}

		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), ctxUserID, claims.UserID)))
	})
}
