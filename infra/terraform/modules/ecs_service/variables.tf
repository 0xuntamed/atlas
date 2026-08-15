variable "name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "container_port" {
  type    = number
  default = 4000
}

variable "image_tag" {
  type    = string
  default = "latest"
}

variable "cpu" {
  type    = number
  default = 256
}

variable "memory" {
  type    = number
  default = 512
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "log_retention_days" {
  type    = number
  default = 30
}

variable "environment" {
  description = "Plain (non-secret) env vars for the container"
  type        = map(string)
  default     = {}
}

variable "secrets" {
  description = "Secret env vars: name => Secrets Manager ARN"
  type        = map(string)
  default     = {}
}

variable "secret_arns" {
  description = "ARNs the execution role may read (usually values() of secrets)"
  type        = list(string)
  default     = []
}
