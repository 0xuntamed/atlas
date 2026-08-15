# Remote state. Create the bucket + lock table once, out of band, then
# `terraform init`. Values are placeholders — set your own.
terraform {
  backend "s3" {
    bucket         = "atlas-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "atlas-terraform-locks"
    encrypt        = true
  }
}
