resource "aws_s3_bucket" "bucket" {
  bucket = "${var.primary_domain}-frontend"
  force_destroy = true
}


resource "aws_s3_bucket_ownership_controls" "bucket_ownership_controls" {
  bucket = aws_s3_bucket.bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "bucket_access_block" {
  bucket = aws_s3_bucket.bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "bucket_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.bucket_ownership_controls,
    aws_s3_bucket_public_access_block.bucket_access_block,
  ]

  bucket = aws_s3_bucket.bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_website_configuration" "bucket_hosting_config" {
  bucket = aws_s3_bucket.bucket.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_cloudfront_distribution" "bucket_distribution" {
  enabled         = true
  is_ipv6_enabled = true
  depends_on = [ var.certificate_arn ]
  origin {
    domain_name = aws_s3_bucket_website_configuration.bucket_hosting_config.website_endpoint
    origin_id   = aws_s3_bucket.bucket.bucket_regional_domain_name

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "http-only"
      origin_read_timeout      = 30
      origin_ssl_protocols = [
        "TLSv1.2",
      ]
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.certificate_arn
    ssl_support_method = "sni-only"
  }

  aliases = [
    var.primary_domain,
    "www.${var.primary_domain}"
  ]

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  default_cache_behavior {
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.bucket.bucket_regional_domain_name
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/"
  }
}

resource "cloudflare_record" "bucket_cname" {
  zone_id = var.cloudflare_zone_id
  name    = var.primary_domain
  value   = aws_cloudfront_distribution.bucket_distribution.domain_name
  type    = "CNAME"
  ttl     = 600
  proxied = false
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.bucket.id
  depends_on = [ aws_s3_bucket_acl.bucket_acl ]
  policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Sid" : "PublicReadGetObject",
          "Effect" : "Allow",
          "Principal" : "*",
          "Action" : "s3:GetObject",
          "Resource" : "arn:aws:s3:::${aws_s3_bucket.bucket.id}/*"
        }
      ]
    }
  )
}