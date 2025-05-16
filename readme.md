# @evert/go-template (⚠️ WIP)
A basic Node.js wrapper for the Go template engine

## Usage: 
```ts
import { parse } from '@evert/go-template';

parse('Hello {{ .name }}', { name: 'World' });
```

## Development
Init the repo
```sh
./scripts/dev-init.sh
```