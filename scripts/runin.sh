#!/usr/bin/env bash

set -e

pushd $1
shift
$@
popd
