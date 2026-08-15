locals {
  name = "atlas-dev"
}

module "network" {
  source = "../../modules/network"
  name   = local.name
}

# The DATABASE_URL secret ARN is needed by the task now; its value is set after
# RDS exists (see aws_secretsmanager_secret_version below). Splitting the secret
# from its version avoids a network↔service↔db dependency cycle.
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

  # Small footprint for dev.
  cpu           = 256
  memory        = 512
  desired_count = 1

  environment = {
    NODE_ENV    = "production"
    AUTH_MODE   = "mock" # switch to "clerk" + add CLERK_SECRET_KEY as a secret
    WEB_ORIGIN  = var.web_origin
    TRUST_PROXY = "true"
  }

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

  instance_class      = "db.t4g.micro"
  multi_az            = false
  deletion_protection = false
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id     = aws_secretsmanager_secret.database_url.id
  secret_string = module.rds.database_url
}
