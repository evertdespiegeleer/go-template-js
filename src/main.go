package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"
	"syscall/js"
	"text/template"
)

func result(output string, errKind string, errMessage string) map[string]any {
	return map[string]any{"output": output, "errorKind": errKind, "errorMessage": errMessage}
}

func renderTemplate(this js.Value, args []js.Value) (res any) {
	defer func() {
		if r := recover(); r != nil {
			res = result("", "panic", fmt.Sprint(r))
		}
	}()

	tpl := args[0].String()
	jsonInput := args[1].String()

	// UseNumber keeps numbers as their literal text, so 1000000 doesn't render as 1e+06.
	decoder := json.NewDecoder(strings.NewReader(jsonInput))
	decoder.UseNumber()
	var data any
	if err := decoder.Decode(&data); err != nil {
		return result("", "json", err.Error())
	}

	t, err := template.New("tpl").Option("missingkey=error").Parse(tpl)
	if err != nil {
		return result("", "parse", err.Error())
	}

	var buf bytes.Buffer
	if err := t.Execute(&buf, data); err != nil {
		return result("", "exec", err.Error())
	}

	return result(buf.String(), "", "")
}

func main() {
	js.Global().Set("__goTemplateRender", js.FuncOf(renderTemplate))
	select {} // Keeps the WASM module running
}
