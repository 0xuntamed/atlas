output "endpoint" {
  value = aws_db_instance.this.address
}

output "port" {
  value = aws_db_instance.this.port
}

output "database_url" {
  description = "Convenience DATABASE_URL (prefer Secrets Manager in the task def)"
  value       = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.this.endpoint}/${var.db_name}?schema=public"
  sensitive   = true
}
