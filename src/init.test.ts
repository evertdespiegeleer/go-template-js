import assert from 'node:assert';
import { test } from "node:test";

// Lives in its own file so the module is cold when imported (node --test runs each file in its own process).
test("concurrent first calls share a single wasm instance", async () => {
    let instantiations = 0;
    const instantiate = WebAssembly.instantiate;
    (WebAssembly as any).instantiate = (...args: any[]) => {
        instantiations++;
        return (instantiate as any)(...args);
    };

    const { parse } = await import('./main.ts')
    const results = await Promise.all(Array.from({length: 20}, (_, index) => parse("{{ .n }}", { n: index })))

    assert.deepEqual(results, Array.from({length: 20}, (_, index) => `${index}`));
    assert.equal(instantiations, 1);
});
