/* @ts-self-types="./shfmt.d.ts" */
import * as wasm from "./shfmt.wasm";
import { format as _format } from "./shfmt_binding.js";

wasm._initialize();

export function format(source, path, options) {
	return _format(wasm, source, path, options);
}
