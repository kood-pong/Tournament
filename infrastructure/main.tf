provider "aws" {
  region = "us-west-2"  
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "3.8.0"

  name = "pong-vpc"
  cidr = var.vpc_cidr

  azs             = ["us-west-2a", "us-west-2b", "us-west-2c"]
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Name = "pong-vpc"
  }
}

module "ecs" {
  source  = "./ecs"
  vpc_id  = module.vpc.vpc_id
  subnets = module.vpc.private_subnets

  cluster_name   = var.cluster_name
  backend_image  = var.backend_image
  frontend_image = var.frontend_image
}
