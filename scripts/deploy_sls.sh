#!/usr/bin/env bash

set -ve

pushd backend
yarn deploy
popd
