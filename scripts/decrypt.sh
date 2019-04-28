#!/usr/bin/env bash

set -ev
echo "$CRYPT_KEY" | base64 -d > crypt.key && git-crypt unlock crypt.key
rm -rf crypt.key
