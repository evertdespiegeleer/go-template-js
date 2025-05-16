package main

import (
	"bytes"
	"encoding/json"
	"syscall/js"
	"text/template"
)

func renderTemplate(this js.Value, args []js.Value) interface{} {
	tpl := args[0].String()       // Template string
	jsonInput := args[1].String() // JSON string input

	var data interface{}
	err := json.Unmarshal([]byte(jsonInput), &data)
	if err != nil {
		return js.ValueOf("JSON parse error: " + err.Error())
	}

	t, err := template.New("tpl").Option("missingkey=error").Parse(tpl)
	if err != nil {
		return js.ValueOf("Template parse error: " + err.Error())
	}

	var buf bytes.Buffer
	err = t.Execute(&buf, data)
	if err != nil {
		return js.ValueOf("Template exec error: " + err.Error())
	}

	return js.ValueOf(buf.String())
}

func main() {
	js.Global().Set("Render", js.FuncOf(renderTemplate))
	select {} // Keeps the WASM module running
}
