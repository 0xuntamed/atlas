locals {
  name = "atlas-prod"
}

module "network" {
  source = "../../modules/network"
  name   = local.name
}

resource "aws_secretsmanager_secret" "database_url" {
  name = "${local.name}/database_url"
}

module "ecs" {
  source             = "../../modules/ecs_service"
  name               = local.name
  vpc_id             = module.network.vpc_id
  public_subnet_ids  = module.network.public_subnet_ids
  private_subnet_ids = module.network.private_subnet_ids
  image_tag          = var.image_tag

  # Prod: more headroom and two tasks behind the ALB.
  cpu           = 512
  memory        = 1024
  desired_count = 2

  environment = {
    NODE_ENV    = "production"
    AUTH_MODE   = "clerk"
    WEB_ORIGIN  = var.web_origin
    TRUST_PROXY = "true"
  }

  # NOTE: add CLERK_SECRET_KEY here as a second Secrets Manager secret when
  # running AUTH_MODE=clerk.
  secrets     = { DATABASE_URL = aws_secretsmanager_secret.database_url.arn }
  secret_arns = [aws_secretsmanager_secret.database_url.arn]
}

module "rds" {
  source                = "../../modules/rds"
  name                  = local.name
  vpc_id                = module.network.vpc_id
  private_subnet_ids    = module.network.private_subnet_ids
  app_security_group_id = module.ecs.app_security_group_id
  db_password           = var.db_password

  instance_class      = "db.t4g.small"
  allocated_storage   = 50
  multi_az            = true
  deletion_protection = true
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id     = aws_secretsmanager_secret.database_url.id
  secret_string = module.rds.database_url
}
