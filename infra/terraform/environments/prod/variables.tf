variable "region" {
  type    = string
  default = "us-east-1"
}

variable "db_password" {
  description = "RDS master password"
  type        = string
  sensitive   = true
}

variable "web_origin" {
  description = "Allowed web origin(s) for CORS (comma-separated)"
  type        = string
}

variable "image_tag" {
  description = "API image tag to deploy from ECR"
  type        = string
}
