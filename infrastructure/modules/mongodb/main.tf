locals  {
    whitelisted_ips = "0.0.0.0/0"
    environment = var.environment
    mongodb_version = var.mongodb_version
    cluster_instance_size_name = var.cluster_instance_size_name
    provider_name = var.provider_name
    backing_provider_name = var.backing_provider_name
    atlas_region = var.atlas_region
}

resource "mongodbatlas_project" "atlas_project" {
  org_id = var.mongodb_atlas_org_id
  name = var.mongodb_atlas_project_name
}

# Create a Database Password
resource "random_password" "db_user_password" {
  length           = 16
  special          = true
  override_special = "^&*"
}

resource "mongodbatlas_database_user" "db_user" {
  username = "user-1"
  password = random_password.db_user_password.result
  project_id = mongodbatlas_project.atlas_project.id
  auth_database_name = "admin"
  roles {
    role_name     = "readWrite"
    database_name = "${var.mongodb_atlas_project_name}-db"
  }
}

resource "mongodbatlas_project_ip_access_list" "ip" {
  project_id = mongodbatlas_project.atlas_project.id
  cidr_block = local.whitelisted_ips
}

resource "mongodbatlas_cluster" "atlas_cluster" {
  project_id   = mongodbatlas_project.atlas_project.id
  name         = "${var.mongodb_atlas_project_name}-${local.environment}-cluster"
  cluster_type = "REPLICASET"

  mongo_db_major_version       = local.mongodb_version
  
  # Provider Settings "block"
  provider_region_name = local.atlas_region
  provider_name               = local.provider_name
  backing_provider_name = local.backing_provider_name
  provider_instance_size_name = local.cluster_instance_size_name
}
