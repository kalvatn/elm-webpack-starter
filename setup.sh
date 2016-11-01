#!/bin/bash

set -e

cd "$(readlink -f "$(dirname "${BASH_SOURCE[0]}")")"

if ! command -v npm > /dev/null; then
  echo "installing node 6.x ..."
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! command -v elm > /dev/null; then
  echo "installing elm ..."
  sudo npm install -g elm
fi

if ! command -v yarn > /dev/null; then
  echo "installing yarn ..."
  sudo npm install -g yarn
fi

echo "installing project dependencies ..."
# npm install
yarn

echo "installing project elm packages ..."
elm package install --yes

echo "compiling elm files ..."
elm make
