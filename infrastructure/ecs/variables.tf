variable "cluster_name" {
  description = "The name of the ECS cluster"
}

variable "backend_image" {
  description = "The Docker image for the backend"
}

variable "frontend_image" {
  description = "The Docker image for the frontend"
}

variable "subnets" {
  description = "The subnets to deploy the ECS services"
  type        = list(string)
}

variable "vpc_id" {
  description = "The VPC ID"
}
