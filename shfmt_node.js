import fs from "node:fs/promises";
import initAsync from "./shfmt.js";

const wasm = new URL("./shfmt.wasm", import.meta.url);

export default function (init = fs.readFile(wasm)) {
	return initAsync(init);
}

export * from "./shfmt.js";
