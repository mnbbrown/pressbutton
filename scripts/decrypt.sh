#!/usr/bin/env bash

set -ev
echo "$CRYPT_KEY" | base64 -i - -d -o crypt.key
git-crypt unlock crypt.key
rm -rf crypt.key
