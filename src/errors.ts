export class TemplatingError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "TemplatingError";
    }
}

export class InvalidTemplateError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "InvalidTemplateError";
    }
}