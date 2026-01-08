export type InitInput =
	| RequestInfo
	| URL
	| Response
	| BufferSource
	| WebAssembly.Module;
export type SyncInitInput = BufferSource | WebAssembly.Module;
import type * as InitOutput from "./shfmt.d.wasm.ts";

export default function initAsync(
	init_input?: InitInput | Promise<InitInput>,
): Promise<InitOutput>;
export declare function initSync(buffer_or_module: SyncInitInput): InitOutput;
export interface FormatOptions {
	indent?: number;
	binaryNextLine?: boolean;
	switchCaseIndent?: boolean;
	spaceRedirects?: boolean;
	funcNextLine?: boolean;
	minify?: boolean;
	singleLine?: boolean;
	simplify?: boolean;
}
export declare function format(
	input: string,
	path?: string,
	options?: FormatOptions,
): string;
