import assert from 'node:assert';
import { describe, test } from "node:test";

describe("Templating Engine", () => {
    test("should render simple template with values", async () => {
        const { parse } = await import('./main.ts')
        const result = await parse(
            "Hello {{.Name}}! You have {{.Count}} unread messages.",
            {
                Name: "John",
                Count: 5,
            }
        );
        assert.equal(result, "Hello John! You have 5 unread messages.");
    });

    test("should be able to render a bunch of templates", async () => {
        const { parse } = await import('./main.ts')
        const results = await Promise.all(Array.from({length: 100}, (_, index) => parse("Hello {{ .number }}!", { number: index })))
        assert.deepEqual(results, Array.from({length: 100}, (_, index) => `Hello ${index}!`));

        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const results2 = await Promise.all(Array.from({length: 100}, (_, index) => parse("Hello {{ .number }}!", { number: index })))
        assert.deepEqual(results2, Array.from({length: 100}, (_, index) => `Hello ${index}!`));
    });

    test("should throw expected error in case a value is missing", async () => {
        const { parse } = await import('./main.ts')
        try {
            await parse(
                "Hello {{.Name}}! You have {{.Count}} unread messages.",
                {
                    Name: "John",
                }
            );
            throw new Error("Expected error to be thrown");
        } catch (error) {
            if (!(error instanceof Error)) {
                throw new Error("Expected error to be an instance of Error");
            }
            assert.equal(
                error.name,
                "TemplatingError"
            )
            assert.equal(
                error.message,
                "map has no entry for key \"Count\""
            );
        }
    });

    test("should throw expected error in case of a faulty template", async () => {
        const { parse } = await import('./main.ts')
        try {
            const result = await parse(
                "Hello {{.Name}}! You have {{.Count} unread messages.",
                {
                    Name: "John",
                    Count: 5,
                }
            );
            throw new Error("Expected error to be thrown");
        } catch (error) {
            if (!(error instanceof Error)) {
                throw new Error("Expected error to be an instance of Error");
            }
            assert.equal(
                error.name,
                "InvalidTemplateError"
            )
        }
    });

    test("should render numbers without scientific notation", async () => {
        const { parse } = await import('./main.ts')
        assert.equal(await parse("{{ .n }} {{ .f }}", { n: 1000000, f: 1.5 }), "1000000 1.5");
    });

    test("should not treat output resembling an error as an error", async () => {
        const { parse } = await import('./main.ts')
        assert.equal(await parse("Template parse error: {{ .x }}", { x: 1 }), "Template parse error: 1");
    });

    test("should accept undefined values", async () => {
        const { parse } = await import('./main.ts')
        assert.equal(await parse("Hello", undefined), "Hello");
    });

    test("should keep the error message when it doesn't match the expected format", async () => {
        const { parse } = await import('./main.ts')
        await assert.rejects(
            parse('{{ define "a" }}{{ template "a" . }}{{ end }}{{ template "a" . }}', {}),
            (error: Error) => error.name === "TemplatingError" && error.message !== "",
        );
        assert.equal(await parse("{{ .x }}", { x: 1 }), "1");
    });
})
