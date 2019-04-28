#!/usr/bin/env bash

set -ev
echo "$CRYPT_KEY" | base64 -i - -D -o crypt.key
git-crypt unlock crypt.key
rm -rf crypt.key
