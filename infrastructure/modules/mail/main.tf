resource "sendgrid_domain_authentication" "domain_authentication" {
    domain = var.domain
    is_default = false
    automatic_security = false
    custom_spf = null
}

resource "cloudflare_record" "sendgrid_domain_validations" {
  count   = 3
  zone_id = var.cloudflare_zone_id
  name    = sendgrid_domain_authentication.domain_authentication.dns[count.index].host
  value   = sendgrid_domain_authentication.domain_authentication.dns[count.index].data
  type    = upper(sendgrid_domain_authentication.domain_authentication.dns[count.index].type)
  priority = upper(sendgrid_domain_authentication.domain_authentication.dns[count.index].type) != "MX" ? null : 5
}

resource "sendgrid_link_branding" "domain_link_branding" {
    domain = var.domain
    is_default = false
}

resource "cloudflare_record" "sendgrid_link_branding_validations" {
  count   = 2
  zone_id = var.cloudflare_zone_id
  name    = sendgrid_link_branding.domain_link_branding.dns[count.index].host
  value   = sendgrid_link_branding.domain_link_branding.dns[count.index].data
  type    = upper(sendgrid_link_branding.domain_link_branding.dns[count.index].type)
  priority = upper(sendgrid_link_branding.domain_link_branding.dns[count.index].type) != "MX" ? null : 5
}