//go:build js && wasm

package main

import (
	"bytes"
	"path/filepath"
	"strings"
	"syscall/js"

	"mvdan.cc/sh/v3/fileutil"
	"mvdan.cc/sh/v3/syntax"
)

func detectLanguage(source string, path string) syntax.LangVariant {
	fileLang := syntax.LangAuto
	extensionLang := strings.TrimPrefix(filepath.Ext(path), ".")
	if err := fileLang.Set(extensionLang); err == nil && fileLang != syntax.LangPOSIX {
		return fileLang
	}
	shebangLang := fileutil.Shebang([]byte(source))
	if err := fileLang.Set(shebangLang); err == nil && fileLang != syntax.LangPOSIX {
		return fileLang
	}
	return syntax.LangBash
}

func createPrinter(options js.Value) *syntax.Printer {
	opts := make([]syntax.PrinterOption, 0, 7)

	if !options.IsUndefined() {
		if indent := options.Get("indent"); indent.Type() == js.TypeNumber {
			opts = append(opts, syntax.Indent(uint(indent.Int())))
		}
		if bn := options.Get("binaryNextLine"); bn.Type() == js.TypeBoolean {
			opts = append(opts, syntax.BinaryNextLine(bn.Bool()))
		}
		if ci := options.Get("switchCaseIndent"); ci.Type() == js.TypeBoolean {
			opts = append(opts, syntax.SwitchCaseIndent(ci.Bool()))
		}
		if sr := options.Get("spaceRedirects"); sr.Type() == js.TypeBoolean {
			opts = append(opts, syntax.SpaceRedirects(sr.Bool()))
		}
		if fn := options.Get("funcNextLine"); fn.Type() == js.TypeBoolean {
			opts = append(opts, syntax.FunctionNextLine(fn.Bool()))
		}
		if mn := options.Get("minify"); mn.Type() == js.TypeBoolean {
			opts = append(opts, syntax.Minify(mn.Bool()))
		}
		if sl := options.Get("singleLine"); sl.Type() == js.TypeBoolean {
			opts = append(opts, syntax.SingleLine(sl.Bool()))
		}
	}

	return syntax.NewPrinter(opts...)
}

func Format(this js.Value, args []js.Value) any {
	if len(args) < 1 {
		return []any{"no source provided", true}
	}

	source := args[0].String()
	path := ""
	if len(args) > 1 {
		path = args[1].String()
	}

	lang := detectLanguage(source, path)

	parser := syntax.NewParser(
		syntax.KeepComments(true),
		syntax.Variant(lang),
	)

	node, err := parser.Parse(strings.NewReader(source), path)
	if err != nil {
		return []any{err.Error(), true}
	}

	var options js.Value
	if len(args) > 2 && args[2].Type() == js.TypeObject {
		options = args[2]
		if sl := options.Get("simplify"); sl.Type() == js.TypeBoolean {
			if sl.Bool() {
				syntax.Simplify(node)
			}
		}
	}

	printer := createPrinter(options)

	var buf bytes.Buffer
	printer.Print(&buf, node)

	return []any{buf.String(), false}
}

func main() {
	done := make(chan bool)
	js.Global().Set("format", js.FuncOf(Format))
	<-done
}
