package main

import (
	"bytes"
	"encoding/json"
	"path/filepath"
	"strings"

	bridge "github.com/wasm-fmt/bridge/fdk-go"
	"mvdan.cc/sh/v3/fileutil"
	"mvdan.cc/sh/v3/syntax"
)

type formatOptions struct {
	Indent           *uint `json:"indent,omitempty"`
	BinaryNextLine   *bool `json:"binaryNextLine,omitempty"`
	SwitchCaseIndent *bool `json:"switchCaseIndent,omitempty"`
	SpaceRedirects   *bool `json:"spaceRedirects,omitempty"`
	FuncNextLine     *bool `json:"funcNextLine,omitempty"`
	Minify           *bool `json:"minify,omitempty"`
	SingleLine       *bool `json:"singleLine,omitempty"`
	Simplify         *bool `json:"simplify,omitempty"`
}

type shfmtFormatter struct{}

func (shfmtFormatter) DefaultConfig() formatOptions {
	return formatOptions{}
}

func (shfmtFormatter) DecodeConfig(config []byte) (formatOptions, error) {
	var opts formatOptions
	if len(config) == 0 {
		return opts, nil
	}
	if err := json.Unmarshal(config, &opts); err != nil {
		return opts, err
	}
	return opts, nil
}

func (shfmtFormatter) Format(source []byte, filename *string, opts formatOptions) bridge.FormatResult {
	path := ""
	if filename != nil {
		path = *filename
	}

	output, err := formatSource(source, path, opts)
	if err == nil && bytes.Equal(source, output) {
		return bridge.Unchanged()
	}
	return bridge.FromBytes(output, err)
}

func formatSource(source []byte, path string, opts formatOptions) ([]byte, error) {
	node, err := parseSource(source, path, opts)
	if err != nil {
		return nil, err
	}

	var buf bytes.Buffer
	if err := createPrinter(opts).Print(&buf, node); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func detectLanguage(source []byte, path string) syntax.LangVariant {
	fileLang := syntax.LangAuto
	extensionLang := strings.TrimPrefix(filepath.Ext(path), ".")
	if err := fileLang.Set(extensionLang); err == nil && fileLang != syntax.LangPOSIX {
		return fileLang
	}
	shebangLang := fileutil.Shebang(source)
	if err := fileLang.Set(shebangLang); err == nil && fileLang != syntax.LangPOSIX {
		return fileLang
	}
	return syntax.LangBash
}

func createPrinter(opts formatOptions) *syntax.Printer {
	printerOpts := make([]syntax.PrinterOption, 0, 7)
	if opts.Indent != nil {
		printerOpts = append(printerOpts, syntax.Indent(*opts.Indent))
	}
	if opts.BinaryNextLine != nil && *opts.BinaryNextLine {
		printerOpts = append(printerOpts, syntax.BinaryNextLine(true))
	}
	if opts.SwitchCaseIndent != nil && *opts.SwitchCaseIndent {
		printerOpts = append(printerOpts, syntax.SwitchCaseIndent(true))
	}
	if opts.SpaceRedirects != nil && *opts.SpaceRedirects {
		printerOpts = append(printerOpts, syntax.SpaceRedirects(true))
	}
	if opts.FuncNextLine != nil && *opts.FuncNextLine {
		printerOpts = append(printerOpts, syntax.FunctionNextLine(true))
	}
	if opts.Minify != nil && *opts.Minify {
		printerOpts = append(printerOpts, syntax.Minify(true))
	}
	if opts.SingleLine != nil && *opts.SingleLine {
		printerOpts = append(printerOpts, syntax.SingleLine(true))
	}

	return syntax.NewPrinter(printerOpts...)
}

func parseSource(source []byte, path string, opts formatOptions) (*syntax.File, error) {
	lang := detectLanguage(source, path)
	parser := syntax.NewParser(
		syntax.KeepComments(true),
		syntax.Variant(lang),
	)
	node, err := parser.Parse(bytes.NewReader(source), path)
	if err != nil {
		return nil, err
	}

	if opts.Simplify != nil && *opts.Simplify {
		syntax.Simplify(node)
	}

	return node, nil
}
