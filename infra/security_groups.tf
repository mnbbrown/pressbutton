resource "aws_security_group" "lambdas" {
  name        = "lambdas"
  description = "Lambda security group"
  vpc_id      = "${aws_vpc.project.id}"

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  tags {
    Name = "${var.project}-lambdas-security-group"
    Project = "${var.project}"
  }
}

output "lambda_security_group" {
  value = "${aws_security_group.lambdas.id}"
}

resource "aws_security_group" "rds" {
  name        = "rds"
  description = "RDS security group"
  vpc_id      = "${aws_vpc.project.id}"

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  tags {
    Name = "${var.project}-rds-security-group"
    Project = "${var.project}"
  }

}
