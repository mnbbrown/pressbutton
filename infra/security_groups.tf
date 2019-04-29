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
    Environment = "${var.environment}"
  }
}

output "lambda_security_group" {
  value = "${aws_security_group.lambdas.id}"
}

resource "aws_security_group" "bastion" {
  name        = "bastion"
  description = "bastion security group"
  vpc_id      = "${aws_vpc.project.id}"

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  tags {
    Name = "${var.project}-bastion-security-group"
    Project = "${var.project}"
    Environment = "${var.environment}"
  }
}

output "bastion_security_group" {
  value = "${aws_security_group.bastion.id}"
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

  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    security_groups = ["${aws_security_group.lambdas.id}", "${aws_security_group.bastion.id}"]
  }

  tags {
    Name = "${var.project}-rds-security-group"
    Project = "${var.project}"
    Environment = "${var.environment}"
  }

}
