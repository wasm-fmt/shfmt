/* @ts-self-types="./shfmt_web.d.ts" */
/**
 * Loads the Wasm module for Vite and bundlers supporting `?init` imports.
 * @module
 */
import init from "./shfmt.wasm?init";
import initAsync from "./shfmt_web.js";
import { format as _format } from "./shfmt.js";

let wasm, wasmModule;

function finalize_init(instance, module) {
	wasm = instance.exports;
	wasmModule = module;
	wasm._initialize();
	return wasm;
}

export default async function initAsync() {
	if (wasm !== void 0) return wasm;
	const instance = await init();
	return finalize_init(instance);
}

export function initSync(module) {
	if (wasm !== void 0) return wasm;

	if (!(module instanceof WebAssembly.Module)) {
		module = new WebAssembly.Module(module);
	}
	const instance = new WebAssembly.Instance(module, getImports());
	return finalize_init(instance, module);
}

export function format(source, path, options) {
	return _format(wasm, source, path, options);
}
