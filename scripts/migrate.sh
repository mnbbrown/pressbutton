#!/usr/bin/env bash

set -e

pushd backend
yarn --frozen-lockfile
yarn migrate
popd

