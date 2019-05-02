#!/usr/bin/env bash
set -e

pushd packages/platform
values=$(pulumi stack output --json)
for s in $(echo $values | jq -r "to_entries|map(\"REACT_APP_\(.key)=\(.value|tostring)\")|.[]" ); do
  export $s
done
popd

env
exit

pushd packages/frontend
yarn build
yarn deploy
popd
