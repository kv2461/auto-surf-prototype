# Auto Surf - Retro Automation Tool (Prototype)

A command-line tool that automates the creation of retrospectives on retrotool.io.

## Quick Start

```bash
# Install dependencies
npm install

# Install browser binaries (Playwright)
npx playwright install

# Run the tool (default: Liked | Learned | Lacked template)
npm run create-retro

# Run with custom title
npm run create-retro title:"Team Sprint Retro"

# Run with different template
npm run create-retro template:madsadglad

# Run with both custom title and template
npm run create-retro title:"Copacetic Retro" template:madsadglad

# Run tests
npm test
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run create-retro` | Create a retrospective with default settings |
| `npm test` | Run test suite with Jest |
| `npm run build` | Compile TypeScript |

## CLI Arguments

- `title:"Custom Title"`: Sets custom retro title (default: "Retro")
- `template:madsadglad`: Uses Mad | Sad | Glad template instead of default

**Note**: Date is automatically appended in YYYY-MM-DD format (e.g., "Retro 2025-09-24")

## Supported Templates

- **Default**: Liked | Learned | Lacked
- `madsadglad`: Mad | Sad | Glad

## Examples

```bash
# Default retrospective (Liked | Learned | Lacked, title "Retro 2025-09-24")
npm run create-retro

# Custom title with default template
npm run create-retro title:"Sprint Review"
# Result: "Sprint Review 2025-09-24" with Liked | Learned | Lacked

# Mad | Sad | Glad template with default title
npm run create-retro template:madsadglad  
# Result: "Retro 2025-09-24" with Mad | Sad | Glad

# Both custom title and template
npm run create-retro title:"Team Retro" template:madsadglad
# Result: "Team Retro 2025-09-24" with Mad | Sad | Glad
```

## Development Approach

This project follows **strict Test-Driven Development (TDD)**:

1. **Write ONE failing test** - Focus on a single behavior
2. **Run `npm test`** - Confirm it fails (RED)
3. **Write minimal code** - Just enough to pass the test
4. **Run `npm test`** - Confirm it passes (GREEN)
5. **Refactor if needed** - Improve code while keeping tests green
6. **Ask for next test** - Get guidance on what to implement next

### Commit Convention
Using Arlo's Commit Notation v2 with **A** prefix for AI commits:
- `A F` - AI Feature
- `A d` - AI Documentation
- `A R` - AI Refactor
- `A B` - AI Bug fix

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - Technical design and structure
- [Development](./docs/DEVELOPMENT.md) - Setup and contributing guide
- [Testing Strategy](./docs/TESTING.md) - Testing approach and principles

## Project Status

This is a **prototype** focused on iterative development. Each major iteration is documented and preserved for reference.


