#!/usr/bin/env deno test --allow-read --parallel
import { format } from "../shfmt_esm.js";

import { assertEquals } from "jsr:@std/assert";
import { expandGlob } from "jsr:@std/fs";
import { fromFileUrl, relative } from "jsr:@std/path";

const test_root = fromFileUrl(new URL("../test_data", import.meta.url));

for await (const entry of expandGlob("*.{sh,zsh,bash}", {
	root: test_root,
	includeDirs: false,
})) {
	const input_path = entry.path;
	const expect_path = input_path + ".golden";
	const input = await Deno.readTextFile(input_path);

	const actual = format(input, input_path);
	const expected = await Deno.readTextFile(expect_path);

	const test_name = relative(test_root, input_path);

	Deno.test(test_name, () => {
		assertEquals(actual, expected);
	});
}
