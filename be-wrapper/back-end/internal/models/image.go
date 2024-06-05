package models

import "github.com/google/uuid"

type Image struct {
	ID           string `db:"id" json:"id"`
	ImageURL     string `db:"image_url" json:"image_url" validate:"required"`
	TournamentID string `db:"tournament_id" json:"tournament_id" validate:"required"`
}

func NewImage() *Image {
	return &Image{
		ID: uuid.New().String(),
	}
}
