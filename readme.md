# @evert/go-template (⚠️ WIP)
A (wasm based) Node wrapper for the Go template engine

## Usage examples: 
```ts
import { parse } from '@evert/go-template';

await parse('Hello {{ .name }}', { name: 'World' });
// Hello World
```

```ts
import { parse } from '@evert/go-template';

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