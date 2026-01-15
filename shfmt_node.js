/* @ts-self-types="./shfmt.d.ts" */
import { readFileSync } from "node:fs";
import { format as _format } from "./shfmt_binding.js";

const wasmUrl = new URL("shfmt.wasm", import.meta.url);
const wasmBytes = readFileSync(wasmUrl);
const wasmModule = new WebAssembly.Module(wasmBytes);

/**
 * @import * as WASM from "./shfmt.wasm"
 */

const instance = new WebAssembly.Instance(wasmModule);
/**
 * @type {WASM}
 */
const wasm = instance.exports;
wasm._initialize();

export function format(source, path, options) {
	return _format(wasm, source, path, options);
}
