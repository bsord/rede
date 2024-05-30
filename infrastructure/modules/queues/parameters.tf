resource "aws_ssm_parameter" "arn" {
    name = "/${var.ssm_path}/arn"
    description = "SQS ARN"
    type = "String"
    value = aws_sqs_queue.this.arn
}

resource "aws_ssm_parameter" "url" {
    name = "/${var.ssm_path}/url"
    description = "SQS URL"
    type = "String"
    value = aws_sqs_queue.this.id
}