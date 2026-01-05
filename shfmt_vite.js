import initAsync from "./shfmt.js";
import wasm_url from "./shfmt.wasm?url";

export default function (input = wasm_url) {
	return initAsync(input);
}

export * from "./shfmt.js";
