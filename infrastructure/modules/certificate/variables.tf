variable "domain" {
  type        = string
  description = "Domain name for the ACM certificate"
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare zone ID for the Domain"
}