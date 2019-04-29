provider "aws" {
  region = "eu-west-2"
}

terraform {
  backend "s3" {
    bucket = "pressbutton-terraform-state"
    key = "terraform.tfstate"
    region = "eu-west-2"
    encrypt = true
  }
}
