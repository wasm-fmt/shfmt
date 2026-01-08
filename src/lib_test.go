package main

import (
	"bytes"
	"flag"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"mvdan.cc/sh/v3/expand"
	"mvdan.cc/sh/v3/syntax"
)

var update = flag.Bool("update", false, "update golden files")

func formatSource(source []byte, path string) ([]byte, error) {
	lang := detectLanguage(source, path)
	parser := syntax.NewParser(
		syntax.KeepComments(true),
		syntax.Variant(lang),
	)
	node, err := parser.Parse(strings.NewReader(string(source)), path)
	if err != nil {
		return nil, err
	}

	printer := syntax.NewPrinter()
	var buf bytes.Buffer
	err = printer.Print(&buf, node)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

func ShellGlob(pattern string) ([]string, error) {
	cfg := &expand.Config{
		ReadDir2: os.ReadDir,
		NullGlob: true,
	}
	var matches []string
	for word, err := range syntax.NewParser().WordsSeq(strings.NewReader(pattern)) {
		if err != nil {
			return nil, err
		}
		for field, err := range expand.FieldsSeq(cfg, word) {
			if err != nil {
				return nil, err
			}
			matches = append(matches, field)
		}
	}
	return matches, nil
}

func TestGolden(t *testing.T) {
	flag.Parse()

	testDataDir := "../test_data"

	matches, err := ShellGlob(filepath.Join(testDataDir, "*.{sh,zsh,bash}"))
	if err != nil {
		t.Fatalf("failed to glob test files: %v", err)
	}

	for _, inputPath := range matches {
		testName := filepath.Base(inputPath)

		t.Run(testName, func(t *testing.T) {
			input, err := os.ReadFile(inputPath)
			if err != nil {
				t.Fatalf("failed to read input file: %v", err)
			}

			actual, err := formatSource(input, inputPath)
			if err != nil {
				t.Fatalf("failed to format: %v", err)
			}

			goldenPath := inputPath + ".golden"

			if *update {
				if err := os.WriteFile(goldenPath, actual, 0644); err != nil {
					t.Fatalf("failed to write golden file: %v", err)
				}
			} else {
				expected, err := os.ReadFile(goldenPath)
				if err != nil {
					t.Fatalf("failed to read golden file: %v", err)
				}

				if !bytes.Equal(actual, expected) {
					t.Errorf("output does not match golden file\nGOT:\n%s\nWANT:\n%s", string(actual), string(expected))
				}
			}
		})
	}
}
