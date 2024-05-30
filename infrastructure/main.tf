###########################
# Primary database
###########################

module "primary_db" {
  source                     = "./modules/mongodb"
  mongodb_atlas_org_id       = var.mongodb_atlas_org_id
  mongodb_atlas_project_name = var.mongodb_atlas_project_name
}

###########################
# Primary Domain Wildcard Cert
###########################

module "primary_domain_wildcard_certificate" {
  source             = "./modules/certificate"
  domain             = var.primary_domain
  cloudflare_zone_id = var.cloudflare_zone_id
}

###########################
# Backend/ApiGateway
###########################

module "backend" {
  source             = "./modules/backend"
  domain             = "api.${var.primary_domain}"
  certificate_arn    = module.primary_domain_wildcard_certificate.certificate_arn
  cloudflare_zone_id = var.cloudflare_zone_id
}

###########################
# Front End
###########################

module "frontend" {
  source             = "./modules/frontend"
  primary_domain     = var.primary_domain
  certificate_arn    = module.primary_domain_wildcard_certificate.certificate_arn
  cloudflare_zone_id = var.cloudflare_zone_id
}


###########################
# Mail domain authentication
###########################

module "mail" {
  source             = "./modules/mail"
  domain             = var.primary_domain
  cloudflare_zone_id = var.cloudflare_zone_id
}

###########################
# Message Queues
###########################

locals {
    queues = {
        subscription-processing = {
            name = "subscription-processing"
            ssm_path = "queue/subscription-processing"

            delay_seconds = 0
            fifo_queue = false
            max_message_size = 262144
            max_receive_count = 3
            message_retention_seconds = 345600
            receive_wait_time_seconds = 0
            visibility_timeout_seconds = 30
        }
    }
}

resource "aws_sqs_queue" "deadletter_queue" {
    name = "deadletter-queue"
    delay_seconds = 0
    max_message_size = 262144
    message_retention_seconds = 345600
    receive_wait_time_seconds = 0
}


module "queues" {
    for_each = local.queues
    source = "./modules/queues"
    deadletter_arn = aws_sqs_queue.deadletter_queue.arn

    queue_name = each.value.name
    ssm_path = each.value.ssm_path

    delay_seconds = each.value.delay_seconds
    fifo_queue = each.value.fifo_queue
    max_message_size = each.value.max_message_size
    max_receive_count = each.value.max_receive_count
    message_retention_seconds = each.value.message_retention_seconds
    receive_wait_time_seconds = each.value.receive_wait_time_seconds
    visibility_timeout_seconds = each.value.visibility_timeout_seconds
}

###########################
# Parameters
###########################

resource "aws_ssm_parameter" "primary_domain_cdn" {
  name        = "primary_domain_cdn"
  type        = "String"
  value       = module.frontend.cdn_bucket_id
  description = "Bucket ID of primary domain CDN"
}

resource "aws_ssm_parameter" "primary_domain_cdn_distribution" {
  name        = "primary_domain_cdn_distribution"
  type        = "String"
  value       = module.frontend.cloudfront_distribution_id
  description = "Distribution ID for primary CDN CloudFront distribution"
}

resource "aws_ssm_parameter" "openai_api_key" {
  name        = "openai_api_key"
  type        = "SecureString"
  value       = var.openai_api_key
  description = "OpenAI api key"
}

resource "cloudflare_record" "dmarc" {
  zone_id = var.cloudflare_zone_id
  name    = "_dmarc.${var.primary_domain}"
  type    = "TXT"
  value   = "v=DMARC1; p=reject;"
}

resource "aws_ssm_parameter" "reddit_client_id" {
  name        = "reddit_client_id"
  type        = "SecureString"
  value       = var.reddit_client_id
  description = "Reddit app client ID"
}

resource "aws_ssm_parameter" "reddit_secret_key" {
  name        = "reddit_secret_key"
  type        = "SecureString"
  value       = var.reddit_secret_key
  description = "Reddit app secret key"
}

resource "aws_ssm_parameter" "reddit_username" {
  name        = "reddit_username"
  type        = "SecureString"
  value       = var.reddit_username
  description = "Username tied to the Reddit app developer account"
}

resource "aws_ssm_parameter" "reddit_password" {
  name        = "reddit_password"
  type        = "SecureString"
  value       = var.reddit_password
  description = "Password for Reddit app developer account"
}

resource "aws_ssm_parameter" "sendgrid_api_key" {
  name        = "sendgrid_api_key"
  type        = "SecureString"
  value       = var.sendgrid_api_key
  description = "Sendgrid API key"
}

resource "aws_ssm_parameter" "primary_db_connection_string" {
  name        = "primary_db_connection_string"
  type        = "SecureString"
  value       = module.primary_db.db_connection_string
  description = "Connection String for primary mongo db"
}

resource "aws_ssm_parameter" "primary_domain_name" {
  name        = "primary_domain_name"
  type        = "String"
  value       = var.primary_domain
  description = "DNS name of primary domain"
}

resource "aws_ssm_parameter" "primary_domain_cert_arn" {
  name        = "primary_domain_cert_arn"
  type        = "String"
  value       = module.primary_domain_wildcard_certificate.certificate_arn
  description = "Certificate ARN for primary domain"
}