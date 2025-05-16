#!/bin/bash

set -e

# Build Go to WASM
GOOS=js GOARCH=wasm go build -o ./src/main.wasm ./src/main.go

# Copy wasm_exec to src
wasm_exec_path=$(go env GOROOT)/misc/wasm/wasm_exec.js
if [ ! -f "$wasm_exec_path" ]; then
  wasm_exec_path=$(go env GOROOT)/lib/wasm/wasm_exec.js
fi
if [ ! -f "$wasm_exec_path" ]; then
  echo "wasm_exec.js not found in GOROOT"
  exit 1
fi

cp $wasm_exec_path ./src
