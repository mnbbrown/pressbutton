resource "aws_vpc" "project" {
  cidr_block = "${var.vpc_cidr}"
  enable_dns_hostnames = true
  tags {
    Name = "${var.project}-vpc"
    Project = "${var.project}"
  }
}

# Public subnets
resource "aws_internet_gateway" "public" {
  vpc_id = "${aws_vpc.project.id}"

  tags {
    Name = "${var.project}-public-internet-gateway"
    Project = "${var.project}"
  }
}

resource "aws_route_table" "public" {
  vpc_id = "${aws_vpc.project.id}"

  tags {
    Name = "${var.project}-public-route-table"
    Project = "${var.project}"
  }
}

resource "aws_route" "public_internet_gateway" {
  gateway_id = "${aws_internet_gateway.public.id}"
  destination_cidr_block = "0.0.0.0/0"
  route_table_id = "${aws_route_table.public.id}"
}

resource "aws_subnet" "public" {
  count = "${length(var.azs)}"
  cidr_block = "${element(concat(var.public_subnet_cidrs, list("")), count.index)}"
  vpc_id = "${aws_vpc.project.id}"
  availability_zone = "eu-west-2a"

  tags {
    Name = "${format("%s-%s-public-subnet", var.project, element(var.azs, count.index))}"
    Project = "${var.project}"
  }
}

resource "aws_route_table_association" "public" {
  count = "${length(var.azs)}"
  route_table_id = "${aws_route_table.public.id}"
  subnet_id = "${element(aws_subnet.public.*.id, count.index)}"
}

## Private subnets
resource "aws_route_table" "private" {
  vpc_id = "${aws_vpc.project.id}"

  tags {
    Name = "${var.project}-private-route-table"
    Project = "${var.project}"
  }
}

resource "aws_route_table_association" "private" {
  route_table_id = "${aws_route_table.private.id}"
  subnet_id = "${aws_subnet.private.id}"
}

resource "aws_route" "nat_gateway" {
  route_table_id = "${aws_route_table.private.id}"
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id = "${aws_nat_gateway.private.id}"
}

resource "aws_subnet" "private" {
  cidr_block = "${var.private_subnet_cidr}"
  vpc_id = "${aws_vpc.project.id}"
  availability_zone = "eu-west-2a"

  tags {
    Name = "${var.project}-eu-west-2a-private-subnet"
    Project = "${var.project}"
  }
}

## Nat gateway
resource "aws_eip" "nat_eip" {
  vpc = true
  tags {
    Name = "${var.project}-nat-eip"
    Project = "${var.project}"
  }
}

resource "aws_nat_gateway" "private" {
  allocation_id = "${aws_eip.nat_eip.id}"
  subnet_id = "${aws_subnet.private.id}"

  tags {
    Name = "${var.project}-private-nat-gateway"
    Project = "${var.project}"
  }
}

## Outputs

output "vpc_id" {
  value = "${aws_vpc.project.id}"
}

output "private_subnet_id" {
  value = "${aws_subnet.private.id}"
}

output "public_subnet_ids" {
  value = "${aws_subnet.public.*.id}"
}
