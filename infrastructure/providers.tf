
terraform {
  cloud {
    organization = "Floydbase"
  }
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    mongodbatlas = {
      source = "mongodb/mongodbatlas"
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
    sendgrid = {
      source = "Trois-Six/sendgrid"
    }
  }
  required_version = ">= 0.13"
}

provider "aws" {
  region = "us-east-1"
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}

# Configure the MongoDB Atlas provider
provider "mongodbatlas" {
  public_key  = var.mongodb_atlas_public_key
  private_key = var.mongodb_atlas_private_key
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "sendgrid" {
    api_key = var.sendgrid_api_key
}