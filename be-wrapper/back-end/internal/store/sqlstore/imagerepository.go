package sqlstore

import "tournament/back-end/internal/models"

type ImageRepository struct {
	store *Store
}

func (i *ImageRepository) Create(image models.Image) (*models.Image, error) {
	query := `INSERT INTO images (id, image_url, tournament_id) VALUES (?, ?, ?)`

	_, err := i.store.Db.Exec(query, image.ID, image.ImageURL, image.TournamentID)
	if err != nil {
		return nil, err
	}

	return &image, nil
}

func (i *ImageRepository) GetAll(tournament_id string) ([]models.Image, error) {
	query := `SELECT * FROM images WHERE tournament_id = ?`

	rows, err := i.store.Db.Query(query, tournament_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var images []models.Image
	for rows.Next() {
		var image models.Image
		if err := rows.Scan(&image.ID, &image.ImageURL, &image.TournamentID); err != nil {
			return nil, err
		}
		images = append(images, image)
	}

	return images, nil
}
