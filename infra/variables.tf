variable "project" {
  description = "project name"
  default = "pressbutton"
}

variable "vpc_cidr" {
  description = "CIDR for the whole VPC"
  default = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDRs for the Public Subnet"
  default = ["10.0.0.0/24","10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidr" {
  description = "CIDR for the Private Subnet"
  default = "10.0.128.0/24"
}

variable "azs" {
  default = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
}
