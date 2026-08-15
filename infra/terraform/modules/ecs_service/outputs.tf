output "alb_dns_name" {
  description = "Public DNS of the API load balancer"
  value       = aws_lb.this.dns_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.api.repository_url
}

output "app_security_group_id" {
  description = "Security group of the API tasks (grant this to RDS)"
  value       = aws_security_group.app.id
}

output "cluster_name" {
  value = aws_ecs_cluster.this.name
}
