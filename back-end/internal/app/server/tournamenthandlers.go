package server

import (
	"errors"
	"fmt"
	"math/rand"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"tournament/back-end/internal/models"
	"tournament/back-end/pkg/validator"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type RequestBody struct {
	TournamentID string `json:"tournament_id" validate:"required"`
	NumberOfSets int    `json:"sets_to_win" validate:"required"`
}

func (s *server) tournamentCreate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var response *models.Tournament

		if err := s.decode(r, &response); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(response); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		t, err := s.store.Tournament().Create(response)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}
		s.respond(w, http.StatusOK, Response{
			Message: "Successfully created tournament!",
			Data:    t,
		})
	}
}

func (s *server) tournamentUpdate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var response *models.Tournament

		if err := s.decode(r, &response); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(response); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		t, err := s.store.Tournament().Update(response)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully updated tournament!",
			Data:    t,
		})
	}
}

func (s *server) tournamentRegister() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tournament_id := r.PathValue("id")
		userId := r.Context().Value(ctxUserID).(string)

		if err := s.store.Tournament().Register(&models.Register{TournamentID: tournament_id, UserID: userId}); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "User successfully registered!",
			Data:    nil,
		})
	}
}

func (s *server) tournamentStart() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request RequestBody

		if err := s.decode(r, &request); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(request); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		matches, err := s.store.Tournament().Start(request.TournamentID, request.NumberOfSets)

		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}
		s.respond(w, http.StatusOK, Response{
			Message: "Tournament started successfully",
			Data:    matches,
		})
	}
}

func (s *server) tournamentGenerate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request RequestBody

		if err := s.decode(r, &request); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		if err := validator.Validate(request); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		matches, err := s.store.Tournament().Generate(request.TournamentID, request.NumberOfSets)

		if matches == nil && err == nil {
			s.respond(w, http.StatusOK, Response{
				Message: "We have a winner, closing a tournament",
				Data:    true,
			})
			return
		}

		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}
		s.respond(w, http.StatusOK, Response{
			Message: "Successfully generated new matches",
			Data:    matches,
		})
	}
}

func (s *server) tournamentLeaderboard() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tournament_id := r.PathValue("id")
		userList, err := s.store.Tournament().GetLeaderboard(tournament_id)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully retrieved leaderboard",
			Data:    userList,
		})

	}
}

func (s *server) tournamentGet() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		year := r.PathValue("year")

		tournaments, err := s.store.Tournament().GetAllByYear(year)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: fmt.Sprintf("Successfully retrieved all tournaments for - %s year", year),
			Data:    tournaments,
		})
	}
}

func (s *server) getUserParticipatedTournaments() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user_id := r.Context().Value(ctxUserID).(string)

		if user_id == "" {
			s.error(w, http.StatusUnauthorized, errors.New("only for logged in users"))
			return
		}

		tournaments, err := s.store.Tournament().GetUserParticipatedTournaments(user_id)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully retrieved all user tournaments",
			Data:    tournaments,
		})
	}
}

func (s *server) tournamentGetOngoing() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		state := r.PathValue("state")
		if state != "ongoing" && state != "open" && state != "finished" {
			s.error(w, http.StatusBadRequest, errors.New("only open, ongoing allowed"))
			return
		}
		tournaments, err := s.store.Tournament().GetAllOngoing(state)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully retrieved all ongoing tournaments",
			Data:    tournaments,
		})
	}
}

func (s *server) tournamentRegisterCheck() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tournament_id := r.PathValue("id")
		user_id := r.Context().Value(ctxUserID).(string)

		if user_id == "" {
			s.error(w, http.StatusUnauthorized, errors.New("unauthorized"))
			return
		}

		b, err := s.store.Tournament().CheckRegister(user_id, tournament_id)
		if err != nil {
			s.respond(w, http.StatusOK, Response{
				Message: err.Error(),
				Data:    b,
			})
			return
		}
		s.respond(w, http.StatusOK, Response{
			Message: "Checked successfully",
			Data:    b,
		})
	}
}

func (s *server) tournamentUnRegister() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tournament_id := r.PathValue("id")
		user_id := r.Context().Value(ctxUserID).(string)

		if user_id == "" {
			s.error(w, http.StatusUnauthorized, errors.New("unauthorized"))
			return
		}

		if err := s.store.Tournament().UnRegister(user_id, tournament_id); err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully unregistered",
			Data:    nil,
		})
	}
}

func (s *server) imageUpload() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(20 << 20)
		if err != nil {
			s.error(w, http.StatusBadRequest, fmt.Errorf("error parsing a formdata %v", err))
			return
		}
		tournament_id := r.PathValue("tournament_id")

		// Get the image file from the form data
		fileHeaders := r.MultipartForm.File["images"]

		for _, fileHeader := range fileHeaders {
			// Open uploaded file
			file, err := fileHeader.Open()
			if err != nil {
				s.error(w, http.StatusInternalServerError, fmt.Errorf("error while opening an uploaded file %v", err))
				return
			}
			defer file.Close()

			extension := filepath.Ext(fileHeader.Filename)
			// Check file content type
			contentType := fileHeader.Header.Get("Content-Type")
			if contentType != "image/jpeg" && contentType != "image/png" {
				s.error(w, http.StatusBadRequest, errors.New("only JPG or PNG files are allowed"))
				return
			}

			// Generate a unique file name for the image
			fileName := generateFileName(tournament_id, extension)

			err = uploadToS3(file, fileName)
			if err != nil {
				s.error(w, http.StatusBadRequest, fmt.Errorf("failed to upload file to S3 %v", err))
				return
			}
			//add file to database
			newImg := models.NewImage()
			newImg.TournamentID = tournament_id
			newImg.ImageURL = fileName
			_, err = s.store.Image().Create(*newImg)
			if err != nil {
				s.error(w, http.StatusBadRequest, fmt.Errorf("failed to insert path to database %v", err))
			}
		}

		s.respond(w, http.StatusOK, Response{
			Message: "Successfully uploaded to S3",
			Data:    nil,
		})
	}
}

func (s *server) imagesGet() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tournament_id := r.PathValue("tournament_id")

		imags, err := s.store.Image().GetAll(tournament_id)
		if err != nil {
			s.error(w, http.StatusUnprocessableEntity, err)
			return
		}

		s.respond(w, http.StatusOK, imags)
	}
}

func uploadToS3(file multipart.File, fileName string) error {
	// Create a new AWS session
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String(region),
		Credentials: credentials.NewStaticCredentials(os.Getenv(awsAccessKey), os.Getenv(awsSecretKey), ""),
	})
	if err != nil {
		return err
	}
	svc := s3.New(sess)

	params := &s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(fileName),
		Body:   file,
	}

	_, err = svc.PutObject(params)
	if err != nil {
		return err
	}

	return nil
}

func generateFileName(tournament_id, extension string) string {
	return tournament_id + "_" + randomString(10) + extension
}

func randomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var result strings.Builder
	for i := 0; i < length; i++ {
		randomIndex := rand.Intn(len(charset))
		result.WriteByte(charset[randomIndex])
	}
	return result.String()
}
