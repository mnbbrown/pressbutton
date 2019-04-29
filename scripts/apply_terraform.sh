#!/usr/bin/env bash

set -e

VAR_FILE="$(pwd)/secrets/${ENVIRONMENT:-dev}.json"
TF_IN_AUTOMATION=true

pushd infra
terraform init
terraform apply -var-file="${VAR_FILE}" -input=false -auto-approve
terraform output --json > outputs.json
popd
