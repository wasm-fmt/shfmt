set -Eeo pipefail

cd $(dirname $0)/..

echo "Building..."
tinygo build -o=shfmt.wasm -target=wasm-unknown -no-debug ./src/lib.go

./scripts/package.mjs ./package.json
