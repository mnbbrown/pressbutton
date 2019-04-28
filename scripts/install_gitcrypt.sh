#!/usr/bin/env bash

set -ev

VERSION=0.6.0
apt-get install -y libssl-dev
wget https://www.agwa.name/projects/git-crypt/downloads/git-crypt-${VERSION}.tar.gz.asc
wget https://www.agwa.name/projects/git-crypt/downloads/git-crypt-${VERSION}.tar.gz
#wget -O andrew.ayer.asc https://www.agwa.name/about/keys/0xEF5D84C1838F2EB6D8968C0410378EFC2080080C.pub.asc
#gpg --import andrew.ayer.asc
#gpg --verify git-crypt-${VERSION}.tar.gz.asc
tar xvf git-crypt-${VERSION}.tar.gz

pushd git-crypt-${VERSION}
make
make install
popd

which git-crypt
rm git-crypt-${VERSION}

