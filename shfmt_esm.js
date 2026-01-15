/* @ts-self-types="./shfmt.d.ts" */
// prettier-ignore
import source wasmModule from "./shfmt.wasm";
import { format as _format } from "./shfmt_binding.js";
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
