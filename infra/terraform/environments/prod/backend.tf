terraform {
  backend "s3" {
    bucket         = "atlas-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "atlas-terraform-locks"
    encrypt        = true
  }
}
