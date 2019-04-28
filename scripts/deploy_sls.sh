#!/usr/bin/env bash

set -ve

pushd backend
yarn --frozen-lockfile
yarn deploy
popd
