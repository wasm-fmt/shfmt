package main

import (
	"bytes"
	"encoding/json"
	"path/filepath"
	"strings"
	"unsafe"

	"mvdan.cc/sh/v3/fileutil"
	"mvdan.cc/sh/v3/syntax"
)

var (
	input, output []byte
	path          string
	opts          formatOptions
)

type outputWriter struct{}

// outputWriter lets syntax.Printer write directly into the global output buffer
func (outputWriter) Write(p []byte) (int, error) {
	output = append(output, p...)
	return len(p), nil
}

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

//go:wasmexport alloc
func Alloc(size uint32) uint32 {
	if size == 0 {
		input = nil
		return 0
	}

	input = make([]byte, size)
	return uint32(uintptr(unsafe.Pointer(&input[0])))
}

//go:wasmexport dispose
func Dispose() {
	input = nil
	output = nil
	path = ""
	opts = formatOptions{}
}

//go:wasmexport set_options
func SetOptions() {
	if input == nil {
		return
	}

	if err := json.Unmarshal(input, &opts); err != nil {
		return
	}
}

//go:wasmexport set_path
func SetPath() {
	if input == nil {
		path = ""
		return
	}

	path = string(input)
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

func createPrinter() *syntax.Printer {
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

//go:wasmexport format
func Format() uint32 {
	node, err := parseSource(input, path)
	if err != nil {
		output = []byte(err.Error())
		return 2
	}

	printer := createPrinter()

	// Clear output length so repeated calls don't append to the
	// previous result and we can reuse the backing array when possible.
	output = output[:0]
	err = printer.Print(outputWriter{}, node)
	if err != nil {
		output = []byte(err.Error())
		return 2
	}

	if bytes.Equal(input, output) {
		return 0
	}

	return 1
}

//go:wasmexport output_ptr
func OutputPtr() uint32 {
	if len(output) == 0 {
		return 0
	}
	return uint32(uintptr(unsafe.Pointer(&output[0])))
}

//go:wasmexport output_len
func OutputLen() uint32 {
	return uint32(len(output))
}

func parseSource(source []byte, path string) (*syntax.File, error) {
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
