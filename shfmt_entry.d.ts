export type InitInput =
	| RequestInfo
	| URL
	| Response
	| BufferSource
	| WebAssembly.Module;
export type SyncInitInput = BufferSource | WebAssembly.Module;
import type * as InitOutput from "./shfmt.d.wasm.ts";

/**
 * Initializes the WASM module asynchronously.
 * @param init_input - Optional URL/path to the WASM file, or any valid InitInput
 */
export default function initAsync(init_input?: InitInput): Promise<InitOutput>;
/**
 * Initializes the WASM module synchronously.
 * @param buffer_or_module - The WASM module or buffer source
 */
export declare function initSync(
	buffer_or_module: BufferSource | WebAssembly.Module,
): InitOutput;

/**
 * Formats a shell script source code.
 * @param source - The shell script source code to format
 * @param path - Optional file path for language detection (e.g., ".bash", ".sh")
 * @param options - Formatting options
 * @returns The formatted shell script
 */
export declare function format(
	source: string,
	path?: string,
	options?: FormatOptions,
): string;

/**
 * Options for formatting shell scripts.
 * These options correspond to shfmt's command-line flags.
 * @see https://pkg.go.dev/mvdan.cc/sh/v3/syntax#PrinterOption
 */
export type FormatOptions = {
	/** Indent sets the number of spaces used for indentation. If set to 0, tabs will be used instead. */
	indent?: number;
	/** BinaryNextLine will make binary operators appear on the next line when a binary command, such as a pipe, spans multiple lines. A backslash will be used. */
	binaryNextLine?: boolean;
	/** SwitchCaseIndent will make switch cases be indented. As such, switch case bodies will be two levels deeper than the switch itself. */
	switchCaseIndent?: boolean;
	/** SpaceRedirects will put a space after most redirection operators. The exceptions are '>&', '<&', '>(', and '<('. */
	spaceRedirects?: boolean;
	/** FunctionNextLine will place a function's opening braces on the next line. */
	funcNextLine?: boolean;
	/** Minify will print programs in a way to save the most bytes possible. For example, indentation and comments are skipped, and extra whitespace is avoided when possible. */
	minify?: boolean;
	/** SingleLine will attempt to print programs in one line. For example, lists of commands or nested blocks do not use newlines in this mode. Note that some newlines must still appear, such as those following comments or around here-documents. */
	singleLine?: boolean;
	/** Simplify will perform a series of simplifications on the AST, to prepare it for printing. */
	simplify?: boolean;
};
