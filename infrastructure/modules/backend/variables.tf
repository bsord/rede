variable "domain" {
  type        = string
  description = "Primary domain name"
}

variable "certificate_arn" {
  type        = string
  description = "ARN of the ACM certificate for the domain"
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare zone ID for the primary domain"
}