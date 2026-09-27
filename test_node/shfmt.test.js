#!/usr/bin/env node --test
import assert from "node:assert/strict";
import { glob, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { createConfig, format, releaseConfig } from "../shfmt_node.js";

const test_root = fileURLToPath(import.meta.resolve("../test_data"));

for await (const case_name of glob("**/*.{sh,zsh,bash}", { cwd: test_root })) {
	if (basename(case_name).startsWith(".")) {
		test.skip(case_name, () => {});
		continue;
	}

	const input_path = join(test_root, case_name);
	const expect_path = input_path + ".golden";

	const [input, expected] = await Promise.all([readFile(input_path, "utf-8"), readFile(expect_path, "utf-8")]);

	test(case_name, () => {
		const actual = format(input, case_name);
		assert.equal(actual, expected);
	});
}

test("inline config without filename", () => {
	const source = "if true; then\necho hi\nfi\n";
	const expected = "if true; then\n  echo hi\nfi\n";

	assert.equal(format(source, { indent: 2 }), expected);
});

test("registered config handle", () => {
	const source = "if true; then\necho hi\nfi\n";
	const expected = "if true; then\n  echo hi\nfi\n";
	const config = createConfig({ indent: 2 });

	try {
		assert.equal(format(source, "script.sh", config), expected);
		assert.equal(format(source, config), expected);
	} finally {
		releaseConfig(config);
	}
});

test("released config handle is rejected", () => {
	const config = createConfig({ indent: 2 });
	releaseConfig(config);

	assert.throws(() => format("echo hi\n", config), /unknown or released config handle/);
});

test("invalid registered config reports an error", () => {
	assert.throws(() => createConfig("not json"), /invalid character|looking for beginning of value/);
});

test("format parse error reports an error", () => {
	assert.throws(() => format("if true; then\n"), /must be followed by a statement list|reached EOF|was not closed/);
});
