import fs from "node:fs/promises";
import "./wasm_exec.js";
import path from "node:path";
import { InvalidTemplateError, TemplatingError } from "./errors.ts";

const go = new Go();
const __filename = new URL(import.meta.url).pathname;
const __dirname = new URL(__filename, import.meta.url).pathname;

export const parse = async (template: string, values: any) => {
    const wasmBuffer = await fs.readFile(path.join(__dirname, "../main.wasm"));
    const { instance } = await WebAssembly.instantiate(wasmBuffer, go.importObject);
    go.run(instance);
    const result = (globalThis as any).Render(template, JSON.stringify(values)) as string;
    go.exit(0);

    if (result.startsWith('Template exec error:')) {
        throw new TemplatingError(result.match(/Template exec error:.+?executing "tpl".+?: (.+)/)?.[1])
    }

    if (result.startsWith('Template parse error:')) {
        throw new InvalidTemplateError(result);
    }

    if (result.startsWith('JSON parse error:')) {
        throw new Error(result);
    }

    return result
}

export * from "./errors.ts";
