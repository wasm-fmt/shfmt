[![Test](https://github.com/wasm-fmt/shfmt/actions/workflows/test.yml/badge.svg)](https://github.com/wasm-fmt/shfmt/actions/workflows/test.yml)

# Install

[![npm](https://img.shields.io/npm/v/@wasm-fmt/shfmt)](https://www.npmjs.com/package/@wasm-fmt/shfmt)

```bash
npm install @wasm-fmt/shfmt
```

[![jsr.io](https://jsr.io/badges/@fmt/shfmt)](https://jsr.io/@fmt/shfmt)

```bash
npx jsr add @fmt/shfmt
```

# Usage

```JavaScript
import init, { format } from "@wasm-fmt/shfmt";

await init();

const source = `#!/bin/bash
echo "hello world"
`;

const formatted = format(source);
console.log(formatted);
```

With options:

```JavaScript
const formatted = format(source, "script.sh", {
  indent: 2,
  binaryNextLine: true,
  switchCaseIndent: false,
  spaceRedirects: true,
  keepPadding: false,
  funcNextLine: false,
  minify: false,
  simplify: true
});
```

# Build from source

```bash
# 1. install Go https://go.dev/doc/install

# 2. install TinyGo https://tinygo.org/getting-started/install/

# 3. clone this repo
git clone https://github.com/wasm-fmt/shfmt.git

# 4. install dependencies inside the repo
npm

# 5. build
npm run build

# 6. test
npm run test:node
```
