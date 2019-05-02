#!/usr/bin/env bash

set -e

pushd packages/platform
pulumi login
pulumi stack select mnbbrown/pushbutton/${ENVIRONMENT:-dev}
yarn deploy
popd
