import fs from "node:fs/promises";
import "./wasm_exec.js";
import path from "node:path";
import {fileURLToPath} from "node:url";
import { InvalidTemplateError, TemplatingError } from "./errors.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type RenderResult = {
    output: string;
    errorKind: "" | "json" | "parse" | "exec" | "panic";
    errorMessage: string;
};

// Cache the init promise rather than the instance, so concurrent first calls share a single Go runtime.
let wasmReady: Promise<void> | undefined;

const initWasm = () => wasmReady ??= (async () => {
    const go = new Go();
    const wasmBuffer = await fs.readFile(path.join(__dirname, "main.wasm"));
    const { instance } = await WebAssembly.instantiate(wasmBuffer, go.importObject);
    // If the Go runtime ever exits, the next call starts a fresh one.
    go.run(instance).finally(() => { wasmReady = undefined; });
})();

export const parse = async (template: string, values: any) => {
    await initWasm();

    const result = (globalThis as any).__goTemplateRender(template, JSON.stringify(values) ?? "null") as RenderResult;

    switch (result.errorKind) {
        case "":
            return result.output;
        case "exec":
            throw new TemplatingError(result.errorMessage.match(/executing "tpl".+?: (.+)/s)?.[1] ?? result.errorMessage);
        case "parse":
            throw new InvalidTemplateError(result.errorMessage);
        default:
            throw new Error(result.errorMessage);
    }
}

export * from "./errors.ts";
