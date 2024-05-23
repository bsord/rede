variable "domain" {
  type        = string
  description = "domain name"
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare zone ID for the primary domain"
}