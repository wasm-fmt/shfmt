import source wasmModule from "./shfmt.wasm";
import { format as _format } from "./shfmt.js";
/**
 * @import * as WASM from "./shfmt.wasm"
 */

const instance = new WebAssembly.Instance(wasmModule);

/**
 * @type {WASM}
 */
let wasm = instance.exports;
wasm._initialize();

export function initSync() {
	return wasm;
}

export default async function initAsync() {
	return wasm;
}

export function format(source, path, options) {
	return _format(wasm, source, path, options);
}
