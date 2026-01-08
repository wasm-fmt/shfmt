import wasm from "./shfmt.wasm";
import { format as _format } from "./shfmt.js";

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
