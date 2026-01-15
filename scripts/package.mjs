#!/usr/bin/env node
import process from "node:process";
import path from "node:path";
import fs from "node:fs";

const pkg_path = path.resolve(process.cwd(), process.argv[2]);
const pkg_text = fs.readFileSync(pkg_path, { encoding: "utf-8" });
const pkg_json = JSON.parse(pkg_text);

// JSR

const jsr_path = path.resolve(pkg_path, "..", "jsr.jsonc");
pkg_json.name = "@fmt/shfmt";
pkg_json.exports = {
	".": "./shfmt.js",
	"./esm": "./shfmt_esm.js",
	"./node": "./shfmt_node.js",
	"./bundler": "./shfmt.js",
	"./web": "./shfmt_web.js",
	// jsr does not support imports from wasm?init
	// "./vite": "./mago_fmt_vite.js",
	// "./wasm": "./shfmt.wasm",
};
pkg_json.exclude = [
	"!**",
	"test_*",
	"src",
	"scripts",
	"node_modules",
	"jsconfig.json",
	"tsconfig.json",
	"dprint.json",
	"*.tgz",
	"*.sh",
	"*.patch",
	"*.mod",
	"*.sum",
	"*.lock",
	".*",
];
fs.writeFileSync(jsr_path, JSON.stringify(pkg_json, null, 4));
