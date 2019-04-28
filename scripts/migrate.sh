#!/usr/bin/env bash

set -e

pushd backend
yarn migrate
popd

