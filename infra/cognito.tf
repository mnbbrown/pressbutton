resource "aws_cognito_user_pool" "pool" {
  name = "${var.project}-${var.environment}"
}

output "cognito_arn" {
  value = "${aws_cognito_user_pool.pool.arn}"
}

output "cognito_endpoint" {
  value = "${aws_cognito_user_pool.pool.endpoint}"
}
