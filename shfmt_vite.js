/* @ts-self-types="./shfmt_entry.d.ts" */
import initAsync from "./shfmt_web.js";
import wasm_url from "./shfmt.wasm?url";

export default function (input = wasm_url) {
	return initAsync(input);
}

export * from "./shfmt_web.js";
