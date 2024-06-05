FROM golang:1.22-alpine 

RUN apk add --no-cache gcc musl-dev sqlite-dev

ENV CGO_ENABLED=1

WORKDIR /build

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go mod tidy

WORKDIR /build/back-end/cmd
RUN go build 

WORKDIR /build/back-end

CMD ["./cmd/cmd"]

