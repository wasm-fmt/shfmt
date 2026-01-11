/* @ts-self-types="./shfmt_entry.d.ts" */
/**
 * Loads the Wasm module via source phase import.
 * @module
 */
// prettier-ignore
import source wasmModule from "./shfmt.wasm";
import { format as _format } from "./shfmt.js";
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
