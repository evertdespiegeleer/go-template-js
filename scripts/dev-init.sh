#!/bin/bash

set -e

# Set git hooks
if command -v git 2>&1 >/dev/null
then
    echo "Setting git hooks path"
    git config --local core.hooksPath ./.hooks
fi

# Set correct node version
if command -v nvm 2>&1 >/dev/null
then
    nvm install
    nvm use
fi