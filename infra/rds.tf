resource "aws_db_subnet_group" "private" {
  name = "${var.project}-${var.environment}-private-subnets"
  subnet_ids = ["${aws_subnet.private.*.id}"]

  tags = {
    Name = "${var.project}-private-subnets"
    Project = "${var.project}"
    Environment = "${var.environment}"
  }
}

resource "aws_db_instance" "project" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "11.2"
  instance_class       = "db.t2.micro"
  name                 = "${var.project}${var.environment}"
  username             = "root"
  password = "${trimspace(file("../secrets/${var.environment}/rds_password.txt"))}"
  db_subnet_group_name = "${aws_db_subnet_group.private.name}"
  publicly_accessible = false

  tags {
    Name = "${var.project}-${var.environment}-rds"
    Project = "${var.project}"
    Environment = "${var.environment}"
  }
}

output "rds_host" {
  value = "${aws_db_instance.project.address}"
}

output "rds_user" {
  value = "${aws_db_instance.project.username}"
}
