resource "aws_ecs_cluster" "this" {
  name = var.cluster_name
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([{
    name      = "backend"
    # Add your backend container configuration here
    # For example:
    # image     = var.backend_image
    # portMappings = [{
    #   containerPort = 8080
    #   hostPort      = 8080
    # }]
  }])
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([{
    name      = "frontend"
    # Add your frontend container configuration here
    # For example:
    # image     = var.frontend_image
    # portMappings = [{
    #   containerPort = 80
    #   hostPort      = 80
    # }]
  }])
}

resource "aws_ecs_service" "backend" {
  name            = "backend"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  # Add network configuration here if needed
}

resource "aws_ecs_service" "frontend" {
  name            = "frontend"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  # Add network configuration here if needed
}

resource "aws_security_group" "ecs" {
  name        = "ecs-sg"
  description = "ECS security group"
  vpc_id      = var.vpc_id

  # Add security group rules if needed
}
