// @ts-check

const encoder = new TextEncoder();

/** @type {import("@wasm-fmt/runtime").FormatterAdapter<typeof import("./shfmt.d.ts")>} */
const adapter = {
	create(wasm, host) {
		const runtime = host.createRuntime(wasm, {
			encodeConfig,
		});

		/** @type {typeof import("./shfmt.d.ts")} */
		const api = {
			/**
			 * @param {string} source
			 * @param {string | object | symbol} [path]
			 * @param {object | symbol} [config]
			 */
			format(source, path, config) {
				return runtime.format(source, path, config);
			},

			/**
			 * @param {object | string} [config]
			 */
			createConfig(config) {
				return /** @type {import("./shfmt.d.ts").ConfigHandle} */ (runtime.createConfig(config ?? {}));
			},

			/**
			 * @param {symbol} handle
			 */
			releaseConfig(handle) {
				return runtime.releaseConfig(handle);
			},
		};
		return api;
	},
};

export default adapter;

/**
 * @param {unknown} config
 * @return {Uint8Array}
 */
function encodeConfig(config) {
	if (typeof config === "string") {
		return encoder.encode(config);
	}

	const json = JSON.stringify(config);
	if (json === undefined) {
		throw new TypeError("config must be JSON serializable");
	}
	return encoder.encode(json);
}
