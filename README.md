# Auto Surf - Retro Automation Tool (Prototype)

A command-line tool that automates the creation of retrospectives on retrotool.io.

## Quick Start

```bash
# Install dependencies
npm install

# Install browser binaries
npm run playwright:install

# Run the tool
npm run dev

# Run with options
npm run dev -- --title "Sprint 15 Retro" --no-date --format mad-sad-glad

# Run tests
npm test
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run the tool in development mode |
| `npm test` | Run test suite with Jest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run build` | Compile TypeScript |
| `npm run lint` | Check code style |

## CLI Options

- `--title` / `-t`: Custom retro title (default: "Team Retro")
- `--no-date`: Exclude current date from title (default: date included as YYYY-MM-DD)
- `--format` / `-f`: Retro format (default: "liked-learned-lacked")

## Supported Formats

- `liked-learned-lacked` (default): What we liked, learned, and lacked
- `mad-sad-glad`: What made us mad, sad, and glad  
- `start-stop-continue`: What to start, stop, and continue
- `plus-delta`: What went well (+) and what to change (Δ)

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - Technical design and structure
- [Development](./docs/DEVELOPMENT.md) - Setup and contributing guide
- [Testing Strategy](./docs/TESTING.md) - Testing approach and principles

## Project Status

This is a **prototype** focused on iterative development. Each major iteration is documented and preserved for reference.


