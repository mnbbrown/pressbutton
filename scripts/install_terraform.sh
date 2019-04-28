#!/usr/bin/env sh

TERRAFORM_VERSION=0.11.13

apt-get install unzip
wget --quiet https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip
unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip
install terraform /usr/local/bin/
rm terraform_${TERRAFORM_VERSION}_linux_amd64.zip
