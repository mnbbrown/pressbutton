resource "aws_db_instance" "project" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgresql"
  engine_version       = "5.7"
  instance_class       = "db.t2.micro"
  name                 = "${var.project}-rds"
  username             = "root"
  parameter_group_name = "default.mysql5.7"
  db_subnet_group_name = "${aws_subnet.private.id}"
  storage_encrypted = true
  publicly_accessible = false
}
