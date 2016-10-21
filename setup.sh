#!/bin/bash

set -e

cd "$(readlink -f "$(dirname "${BASH_SOURCE[0]}")")"

echo "installing elm globally..."
sudo npm install -g elm
echo "installing project dependencies..."
npm install
echo "installing project elm packages..."
elm package install --yes
echo "compiling elm files..."
elm make
