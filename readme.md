# @evertdespiegeleer/go-template
A (wasm based) Node wrapper for the Go template engine
The inner workings are totally different, but the library heavilly is inspired by [@ctrl/golang-template](https://github.com/scttcper/golang-template).

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

## Development
Init the repo
```sh
./scripts/dev-init.sh
```