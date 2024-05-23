output "cdn_bucket_id" {
  value = aws_s3_bucket.bucket.id
}

output "cloudfront_distribution_domain_name" {
  value = aws_cloudfront_distribution.bucket_distribution.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.bucket_distribution.id
}