output "db_connection_string" {
  value = "${replace(mongodbatlas_cluster.atlas_cluster.connection_strings[0].standard_srv, "mongodb+srv://", "mongodb+srv://${mongodbatlas_database_user.db_user.username}:${coalesce(nonsensitive(mongodbatlas_database_user.db_user.password), "null")}@")}/${var.mongodb_atlas_project_name}-db"
}