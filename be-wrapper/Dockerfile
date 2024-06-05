FROM golang:1.22-alpine AS builder

WORKDIR /build

COPY . .

RUN go mod download

RUN go mod tidy

RUN apk add --no-cache sqlite-dev

RUN go get github.com/mattn/go-sqlite3

WORKDIR /build/back-end/cmd

RUN go build -o ./pongapi .

FROM gcr.io/distroless/base-debian12

WORKDIR /app

COPY --from=builder /build/back-end/cmd/pongapi ./pongapi

CMD ["/app/pongapi"]