variable "name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "app_security_group_id" {
  description = "Security group of the ECS service allowed to reach Postgres"
  type        = string
}

variable "db_name" {
  type    = string
  default = "atlas"
}

variable "db_username" {
  type    = string
  default = "atlas"
}

variable "db_password" {
  description = "Master password (source from Secrets Manager / a tfvars secret)"
  type        = string
  sensitive   = true
}

variable "instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "allocated_storage" {
  type    = number
  default = 20
}

variable "multi_az" {
  type    = bool
  default = false
}

variable "backup_retention_days" {
  type    = number
  default = 7
}

variable "deletion_protection" {
  type    = bool
  default = false
}
