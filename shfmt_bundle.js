/* @ts-self-types="./shfmt_entry.d.ts" */
import wasm from "./shfmt.wasm";
import { format as _format } from "./shfmt.js";

wasm._initialize();

export function format(source, path, options) {
	return _format(wasm, source, path, options);
}
