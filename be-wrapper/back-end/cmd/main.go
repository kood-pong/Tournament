package main

import (
	"log"
	"os"
	"tournament/back-end/internal/app/server"
)


func init() {
	jwtKey := os.Getenv("JWT_KEY")
	if jwtKey == "" {
		log.Fatalf("error: env variable JWT_KEY is not set")
	}

	// flag.StringVar(&configPath, "config-path", "./configs/config.json", "path to config")
}

func main() {
	// flag.Parse()

	// config := server.NewConfig()
	// err := config.ReadConfig(configPath)
	// if err != nil {
	// 	log.Fatalf("Error reading config file: %s\n", err)
	// }

	// mux := http.NewServeMux()
	// mux.HandleFunc("/", testHandler())
	// http.ListenAndServe(":8080", mux)
	log.Fatal(server.Start())
}

// package server

// import (
// 	"encoding/json"
// 	"os"
// )

// type Config struct {
// 	Port           string `json:"port"`
// 	DatabaseURL    string `json:"database_url"`
// 	DatabaseSchema string `json:"database_schema"`
// }

// func NewConfig() *Config {
// 	return &Config{}
// }

// func (c *Config) ReadConfig(path string) error {
// 	data, err := os.ReadFile(path)
// 	if err != nil {
// 		return err
// 	}

// 	err = json.Unmarshal(data, c)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }
