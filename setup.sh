#!/bin/bash

set -e

cd "$(readlink -f "$(dirname "${BASH_SOURCE[0]}")")"

if ! command -v elm > /dev/null; then
  echo "installing elm globally..."
  sudo npm install -g elm
fi
echo "installing project dependencies..."
npm install

echo "installing project elm packages..."
elm package install --yes

echo "compiling elm files..."
elm make
