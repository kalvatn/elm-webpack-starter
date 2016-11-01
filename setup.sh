#!/bin/bash

set -e

ROOT="$(readlink -f "$(dirname "${BASH_SOURCE[0]}")")"

if ! command -v npm > /dev/null; then
  echo "installing node 6.x globally ..."
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! command -v elm > /dev/null; then
  echo "installing elm globally ..."
  sudo npm install -g elm
fi

if ! command -v yarn > /dev/null; then
  echo "installing yarn globally ..."
  sudo npm install -g yarn
fi

for dir in backend frontend; do
  cd "$ROOT/$dir"
  echo "installing project $dir dependencies ..."
  yarn
done
