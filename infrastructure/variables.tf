variable "region" {
  description = "The AWS region to create resources in"
  default     = "us-west-2"  
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  default     = "10.0.0.0/16"  
}

variable "private_subnets" {
  description = "A list of private subnets"
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]  
}

variable "public_subnets" {
  description = "A list of public subnets"
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]  
}

variable "cluster_name" {
  description = "The name of the ECS cluster"
  default     = "pong-cluster"  
}

variable "backend_image" {
  description = "The Docker image for the backend"
}

variable "frontend_image" {
  description = "The Docker image for the frontend"
}
