#!/usr/bin/env bash

set -e

pushd infra
terraform init
popd
