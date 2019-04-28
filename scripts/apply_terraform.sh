#!/usr/bin/env bash

set -e

VAR_FILE="$(pwd)/secrets/${ENVIRONMENT:-dev}.json"
echo $VAR_FILE

pushd infra
terraform init
terraform apply -var-file="${VAR_FILE}"
terraform output --json > outputs.json
popd
