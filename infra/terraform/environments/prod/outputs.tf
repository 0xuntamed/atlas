output "api_url" {
  description = "Public API endpoint (add TLS/ACM + Route 53 for production)"
  value       = "http://${module.ecs.alb_dns_name}"
}

output "ecr_repository_url" {
  value = module.ecs.ecr_repository_url
}

output "db_endpoint" {
  value = module.rds.endpoint
}
