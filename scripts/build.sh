set -Eeo pipefail

cd $(dirname $0)/..

echo "Building..."
tinygo build -o=shfmt.wasm -target=wasm -no-debug ./src/lib.go

echo "Generating JS..."
node ./scripts/transform.mjs $(tinygo env TINYGOROOT)/targets/wasm_exec.js ./shfmt.js ./shfmt.wasm

./scripts/package.mjs ./package.json
