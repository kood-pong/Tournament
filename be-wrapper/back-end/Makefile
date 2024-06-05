all: clean test build run

test:
	@echo "Running tests..."
	@go test -v ./...

build:
	@echo "Building binary..."
	@go build -o ./build/api ./cmd/main.go

clean:
	@echo "Cleaning up..."
	@rm -rf ./build

run: build
	@echo "Running API..."
	@./build/api

.PHONY: all test build clean run
