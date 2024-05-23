resource "aws_acm_certificate" "domain_cert" {
  domain_name = var.domain
  validation_method = "DNS"

  subject_alternative_names = [
    var.domain,
    "*.${var.domain}"
  ]

  lifecycle {
    create_before_destroy = true
  }
}

data "cloudflare_zone" "primary_zone" {
  zone_id = var.cloudflare_zone_id
}

resource "cloudflare_record" "domain_cert_validation_records" {
  for_each = {
    for dvo in aws_acm_certificate.domain_cert.domain_validation_options : dvo.domain_name => {
      zone_id = var.cloudflare_zone_id
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id         = each.value.zone_id
  name            = trimsuffix(each.value.name, ".${data.cloudflare_zone.primary_zone.name}.")
  value           = each.value.record
  type            = each.value.type
  ttl             = 600
  proxied         = false
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "domain_cert_validation" {
  certificate_arn         = aws_acm_certificate.domain_cert.arn
  validation_record_fqdns = [for record in cloudflare_record.domain_cert_validation_records : record.hostname]
}