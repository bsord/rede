resource "aws_sqs_queue" "this" {
    name = "${var.queue_name}"

    delay_seconds = var.delay_seconds
    fifo_queue = var.fifo_queue
    max_message_size = var.max_message_size
    message_retention_seconds = var.message_retention_seconds
    receive_wait_time_seconds = var.receive_wait_time_seconds
    visibility_timeout_seconds = var.visibility_timeout_seconds

    redrive_policy = jsonencode({
        deadLetterTargetArn = var.deadletter_arn
        maxReceiveCount = var.max_receive_count
    })
}

data "aws_iam_policy_document" "sqs_policy" {
    version = "2012-10-17"
    policy_id = "SQSLambdaEvents"

    statement {
        effect = "Allow"
        actions = ["sqs:*", "lambda:*"]
        resources = ["*"]
    }
}

resource "aws_sqs_queue_policy" "lambda_events" {
  queue_url = aws_sqs_queue.this.id

  policy = data.aws_iam_policy_document.sqs_policy.json
}