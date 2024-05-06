
variable "primary_domain" {
    type        = string
    description = "Primary DNS Zone that gets created"
}

variable "mongodb_atlas_public_key" {
    type        = string
    description = "MongoDB Atlas api public key"
}

variable "mongodb_atlas_private_key" {
    type        = string
    description = "MongoDB Atlas api private key"
}

variable "mongodb_atlas_org_id" {
    type        = string
    description = "MongoDB Atlas Organization ID"
}

variable "cloudflare_account_id" {
    type        = string
    description = "Cloudflare account ID"
}

variable "cloudflare_api_token" {
    type        = string
    description = "Cloudflare api token"
}

variable "cloudflare_zone_id" {
    type        = string
    description = "Cloudflare zone id"
}

variable "openai_api_key" {
    type        = string
    description = "OpenAI api key"
}
