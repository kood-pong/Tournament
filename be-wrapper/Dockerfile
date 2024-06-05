# Stage 1: Build the Go binary with CGO enabled
FROM golang:1.22-alpine 

# Install gcc and other necessary libraries
RUN apk add --no-cache gcc musl-dev sqlite-dev

# Enable CGO
ENV CGO_ENABLED=1

WORKDIR /build

# Copy the go.mod and go.sum files first to leverage Docker layer caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the remaining source files
COPY . .

# Tidy up the modules
RUN go mod tidy

# Build the Go binary
WORKDIR /build/back-end/cmd
RUN go build 

WORKDIR /build/back-end

CMD ["./cmd/cmd"]

