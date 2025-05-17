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
})