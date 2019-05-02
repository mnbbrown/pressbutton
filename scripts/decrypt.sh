#!/usr/bin/env bash

set -e
echo "$CRYPT_KEY" | base64 -d > crypt.key && git-crypt unlock crypt.key
rm -rf crypt.key
