
resource "aws_api_gateway_domain_name" "api_gateway_domain" {
  domain_name              = var.domain
  regional_certificate_arn = var.certificate_arn

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "cloudflare_record" "api_gateway_domain" {
  zone_id = var.cloudflare_zone_id
  name    = var.domain
  value   = aws_api_gateway_domain_name.api_gateway_domain.regional_domain_name
  type    = "CNAME"
  ttl     = 60
  proxied = false
}