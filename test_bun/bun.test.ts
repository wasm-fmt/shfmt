#!/usr/bin/env bun test
import { expect, test } from "bun:test";
import init, { format } from "../shfmt_node";
import path from "node:path";
import { Glob } from "bun";

await init();

const test_root = Bun.fileURLToPath(new URL("../test_data", import.meta.url));

const glob = new Glob("**/*.{sh,zsh,bash}");

for await (const input_path of glob.scan({ cwd: test_root })) {
	const full_input_path = path.join(test_root, input_path);
	const expect_path = full_input_path + ".golden";

	const [input, expected] = await Promise.all([
		Bun.file(full_input_path).text(),
		Bun.file(expect_path).text(),
	]);

	const actual = format(input, input_path);

	test(input_path, () => {
		expect(actual).toBe(expected);
	});
}
