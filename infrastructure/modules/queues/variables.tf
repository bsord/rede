variable "deadletter_arn" { type = string }

variable "queue_name" { type = string }

variable "ssm_path" { type = string }

variable "delay_seconds" { type = number }

variable "fifo_queue" { type = bool }

variable "max_receive_count" { type = number }

variable "max_message_size" { type = number }

variable "message_retention_seconds" { type = number }

variable "receive_wait_time_seconds" { type = number }

variable "visibility_timeout_seconds" { type = number }