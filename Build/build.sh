#!/bin/bash

# Prevent packing of resource fork files on macOS (./._xxxxx)
export COPYFILE_DISABLE=true

set -e

pushd "${0%/*}" # Go to script directory
BUILD_DIR="$(pwd)"
OUTPUT_DIR="$BUILD_DIR/Output"

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

echo "--- Building project..."
cd "../Source/chainium-wallet"
npm ci
npm run build -- --prod
gulp inline

echo "--- Creating package..."
cd "dist"
rm -rf wallet
mkdir wallet
cp single-file-wallet/index.html wallet
cp chainium-wallet/favicon.ico wallet
tar czf "$OUTPUT_DIR/Own.Wallet.App.tar.gz" wallet
rm -rf wallet

popd # Go back to caller directory

# Show build output
echo "--- Build output in $OUTPUT_DIR"
ls -lh "$OUTPUT_DIR"
