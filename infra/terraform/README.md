# ATLAS — Infrastructure (Terraform)

**Optional** AWS deployment for the API (the primary path is Vercel for the web
app + Render/Railway for the API + Neon/Supabase for Postgres, which needs none
of this). This models the "Option B" architecture from the build spec:

```
Internet → CloudFront → Vercel (web)
Internet → ALB → ECS Fargate (Node API) → RDS PostgreSQL
```

No Kubernetes — it adds no value at this scale.

## Layout

```
infra/terraform/
├── modules/
│   ├── network/       VPC, public/private subnets, IGW, NAT, routes
│   ├── rds/           PostgreSQL instance, subnet group, security group
│   └── ecs_service/   ECR, ECS cluster + Fargate service, ALB, task def, IAM, logs
└── environments/
    ├── dev/           wires the modules for dev (small instances)
    └── prod/          wires the modules for prod (larger, multi-AZ)
```

Each environment is an independent root module with its own state
(`backend.tf`) and its own `terraform.tfvars`.

## Usage

```bash
cd infra/terraform/environments/dev
cp terraform.tfvars.example terraform.tfvars   # fill in values
terraform init
terraform plan
terraform apply
```

## Notes / not-yet-wired

- **Secrets**: `DATABASE_URL` and Clerk keys should come from AWS Secrets Manager
  and be injected into the task definition as `secrets` (not plain env). The
  task-execution role includes a placeholder policy for this.
- **State backend**: `backend.tf` uses an S3 bucket + DynamoDB lock table you
  must create once, out of band.
- **TLS / domains**: ALB HTTPS listener + ACM certificate + Route 53 records are
  left as a TODO — add once a domain is chosen.

This is a scaffold: the HCL is idiomatic and structured, but has not been
`apply`-ed against a live AWS account.
