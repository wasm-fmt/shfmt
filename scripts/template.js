/**
 * ================== End of wasm_exec.js ==================
 */
let wasm, wasmModule;
async function __load(module, imports) {
	if (typeof Response === "function" && module instanceof Response) {
		if (typeof WebAssembly.instantiateStreaming === "function") {
			try {
				return await WebAssembly.instantiateStreaming(module, imports);
			} catch (e) {
				if (module.headers.get("Content-Type") != "application/wasm") {
					console.warn(
						"`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
						e,
					);
				} else {
					throw e;
				}
			}
		}
		const bytes = await module.arrayBuffer();
		return await WebAssembly.instantiate(bytes, imports);
	} else {
		const instance = await WebAssembly.instantiate(module, imports);
		if (instance instanceof WebAssembly.Instance)
			return { instance, module };
		else return instance;
	}
}
function __finalize_init(instance, module) {
	(wasm = instance.exports), (wasmModule = module);
	return wasm;
}

export function initSync(module) {
	if (wasm !== void 0) return wasm;

	const go = new Go();
	const imports = go.importObject;

	if (!(module instanceof WebAssembly.Module))
		module = new WebAssembly.Module(module);

	const instance = new WebAssembly.Instance(module, imports);

	go.run(instance);
	return __finalize_init(instance, module);
}
export default async function initAsync(input) {
	if (wasm !== void 0) return wasm;

	if (input === void 0) input = new URL("shfmt.wasm", import.meta.url);

	const go = new Go();
	const imports = go.importObject;

	if (
		typeof input === "string" ||
		(typeof Request === "function" && input instanceof Request) ||
		(typeof URL === "function" && input instanceof URL)
	) {
		input = fetch(input);
	}

	const { instance, module } = await __load(await input, imports);

	go.run(instance);
	return __finalize_init(instance, module);
}
var _format = function () {
	throw new Error("wasm not initialized.");
};
export function format(input, path, options) {
	const [result, err] = _format(input, path, options);
	if (err) {
		throw new Error(result);
	}
	return result;
}
