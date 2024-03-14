package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"tournament/back-end/internal/app/server"
)

var configPath string

func init() {
	jwtKey := os.Getenv("JWT_KEY")
	if jwtKey == "" {
		log.Fatalf("error: env variable JWT_KEY is not set")
	}

	flag.StringVar(&configPath, "config-path", "./configs/config.json", "path to config")
}

func main() {
	flag.Parse()

	config := server.NewConfig()
	err := config.ReadConfig(configPath)
	if err != nil {
		log.Fatalf("Error reading config file: %s\n", err)
	}

	// mux := http.NewServeMux()
	// mux.HandleFunc("/", testHandler())
	// http.ListenAndServe(":8080", mux)
	log.Fatal(server.Start(config))
	// fmt.Println("DSADASDASDAS")
}

func testHandler() http.HandlerFunc{
	return func(w http.ResponseWriter, r *http.Request){
		fmt.Println("TESTDSADSADSADSA")
	}
}
