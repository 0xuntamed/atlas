variable "name" {
  description = "Name prefix for tagging (e.g. atlas-dev)"
  type        = string
}

variable "cidr_block" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}
