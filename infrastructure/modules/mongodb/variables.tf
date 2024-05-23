variable "environment" {
  type        = string
  default     = "production"
  description = "Environment (e.g. dev, prod)"
}

variable "mongodb_version" {
  type        = string
  default     = "7.0"
  description = "MongoDB version"
}

variable "cluster_instance_size_name" {
  type        = string
  default     = "M0"
  description = "Cluster instance size name"
}

variable "provider_name" {
  type        = string
  default     = "TENANT"
  description = "Provider name"
}

variable "backing_provider_name" {
  type        = string
  default     = "AWS"
  description = "Backing provider name"
}

variable "atlas_region" {
  type        = string
  default     = "US_EAST_1"
  description = "Atlas region"
}

variable "mongodb_atlas_org_id" {
    type        = string
    description = "MongoDB Atlas Organization ID"
}

variable "mongodb_atlas_project_name" {
  type        = string
  description = "Project Name for mongodb"
}