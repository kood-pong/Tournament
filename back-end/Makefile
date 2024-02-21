.PHONY: build run-api 
.SILENT:

build:
	go build -o ./build/api ./cmd/main.go

run-api: build
	export JWT_KEY=09aa18a89dee21de8382b9ef169dc5d39130d7036e8b61f20a350ffb0da330cf && \
	./build/api
