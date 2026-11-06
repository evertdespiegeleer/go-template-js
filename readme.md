# @evertdespiegeleer/go-template
A (wasm based) Node wrapper for the Go template engine

While the inner workings are totally different, the library is heavilly inspired by [@ctrl/golang-template](https://github.com/scttcper/golang-template).

## Installation
```sh
npm i @evertdespiegeleer/go-template
```

## Usage examples: 
```ts
import { parse } from '@evertdespiegeleer/go-template';

await parse('Hello {{ .name }}', { name: 'World' });
// Hello World
```

```ts
import { parse } from '@evertdespiegeleer/go-template';

await parse('{{ range . }}Hi {{ .name }}!\n{{ end }}', [
    { name: 'Evert' },
    { name: 'John' },
]);
// Hi Evert!
// Hi John!
```

## Memory usage
The Go runtime lives in WebAssembly memory, which can grow but never shrinks. A long-running process keeps the memory of its largest render (template, values and output combined) for its whole lifetime.

## Development
Init the repo
```sh
./scripts/dev-init.sh
```