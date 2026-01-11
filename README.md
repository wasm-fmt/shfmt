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

## Node.js / Deno / Bun / Bundler

```javascript
import { format } from "@wasm-fmt/shfmt";

const source = `#!/bin/bash
echo "hello world"
`;

const formatted = format(source);
console.log(formatted);
```

With options:

```javascript
const formatted = format(source, "script.sh", {
	indent: 2,
	binaryNextLine: true,
	switchCaseIndent: false,
	spaceRedirects: true,
	funcNextLine: false,
	minify: false,
	singleLine: false,
	simplify: true,
});
```

## Web

For web environments, you need to initialize WASM module manually:

```javascript
import init, { format } from "@wasm-fmt/shfmt/web";

await init();

const source = `#!/bin/bash
echo "hello world"
`;

const formatted = format(source);
console.log(formatted);
```

### Vite

```JavaScript
import init, { format } from "@wasm-fmt/shfmt/vite";

await init();
// ...
```

## Entry Points

- `.` - Auto-detects environment (Node.js uses node, Webpack uses bundler, default is ESM)
- `./node` - Node.js environment (no init required)
- `./esm` - ESM environments like Deno (no init required)
- `./bundler` - Bundlers like Webpack (no init required)
- `./web` - Web browsers (requires manual init)
- `./vite` - Vite bundler (requires manual init)

## Build from source

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

# Credits

Thanks to:

- The [shfmt](https://github.com/mvdan/sh) project created by [Daniel Martí](https://github.com/mvdan)
