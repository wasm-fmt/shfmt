import { defineBindings } from "@wasm-fmt/bindgen";

export default defineBindings({
	name: "shfmt",
	wasm: "shfmt.wasm",
	adapter: "bindings/shfmt_binding.js",
	types: {
		main: "bindings/shfmt.d.ts",
	},
	outDir: ".",
});
