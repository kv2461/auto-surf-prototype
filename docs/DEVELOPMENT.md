# Development Guide

## Setup

### Prerequisites
- Node.js 18+ (recommended: latest LTS)
- npm or yarn
- Git

### Installation

```bash
# Clone and navigate to project
cd prototype

# Install dependencies  
npm install

# Install browser binaries for Playwright
npm run playwright:install

# Verify setup
npm test
```

## Development Workflow

### TDD Approach
This project follows Test-Driven Development:

1. **Write a failing test first**
2. **Write minimal code to pass**
3. **Refactor while keeping tests green**

### Daily Development Cycle

```bash
# Start development with test watching
npm run test:watch

# In another terminal, start development
npm run dev

# Make changes, see tests update in real-time
# Commit when tests pass and code is clean
```

### Code Quality Gates

Before committing, ensure:
- ✅ All tests pass: `npm test`
- ✅ Types are correct: `npm run build`
- ✅ Code is formatted: `npm run lint`
- ✅ Coverage is maintained: `npm run test:coverage`

## File Organization

### Naming Conventions
- **Classes**: PascalCase (`ConfigBuilder`)
- **Files**: camelCase (`config.ts`, `browser.ts`)
- **Tests**: `*.test.ts` (`config.test.ts`)
- **Types**: PascalCase interfaces (`RetroConfig`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_TITLE`)

### Import Organization
```typescript
// 1. Node/npm modules
import { format } from 'date-fns';
import { Browser } from 'playwright';

// 2. Internal modules (relative imports)
import { RetroConfig, CLIOptions } from './types';
import { ConfigBuilder } from './config';

// 3. Type-only imports last
import type { BrowserConfig } from './types';
```

## Adding New Features

### 1. Start with Types
```typescript
// Add to types.ts first
export interface NewFeatureConfig {
  option: string;
  enabled: boolean;
}
```

### 2. Write Tests (TDD)
```typescript
// Create tests/newFeature.test.ts
describe('NewFeature', () => {
  it('should handle basic scenario', () => {
    // Test first, implementation after
  });
});
```

### 3. Implement Feature
```typescript
// Create src/newFeature.ts
export class NewFeature {
  // Implement to pass tests
}
```

### 4. Integration
```typescript
// Update src/index.ts or relevant files
// Add CLI options if needed
// Update documentation
```

## Browser Automation Guidelines

### Playwright Best Practices
- Use `page.waitForSelector()` instead of timeouts
- Prefer `data-testid` over fragile CSS selectors
- Handle errors gracefully with try/catch
- Take screenshots on failures for debugging

```typescript
// Good: Robust selector strategy
await page.waitForSelector('[data-testid="retro-format-select"]');

// Better: With error handling
try {
  await page.waitForSelector('[data-testid="retro-format-select"]', {
    timeout: 10000
  });
} catch (error) {
  await page.screenshot({ path: 'debug-failure.png' });
  throw new NavigationError('Could not find format selector');
}
```

### Testing Browser Code
Always mock Playwright in unit tests:

```typescript
// Mock browser interactions
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn().mockResolvedValue({
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        waitForSelector: jest.fn(),
        click: jest.fn(),
      })
    })
  }
}));
```

## Configuration Management

### Adding New CLI Options

1. **Update types.ts**
```typescript
export interface CLIOptions {
  newOption?: string;
}
```

2. **Update ConfigBuilder**
```typescript
static buildConfig(options: CLIOptions): RetroConfig {
  // Handle new option
}
```

3. **Add tests**
```typescript
it('should handle new option', () => {
  const config = ConfigBuilder.buildConfig({ newOption: 'value' });
  expect(config.newOption).toBe('value');
});
```

4. **Update CLI parser** (when we create it)

## Error Handling Patterns

### Custom Error Classes
```typescript
export class RetroCreationError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'RetroCreationError';
  }
}
```

### Error Boundaries
```typescript
// Wrap operations that can fail
try {
  const result = await createRetro(config);
  return result;
} catch (error) {
  if (error instanceof NavigationError) {
    // Handle navigation-specific errors
    throw new RetroCreationError('Failed to navigate site', error);
  }
  // Re-throw unknown errors
  throw error;
}
```

## Performance Considerations

### Browser Performance
- Use headless mode by default
- Reuse browser instances when possible
- Set reasonable timeouts
- Clean up resources properly

### Memory Management
- Close browsers after use
- Avoid memory leaks in long-running processes
- Monitor memory usage during development

## Debugging

### Debug Configuration
```bash
# Run with debug output
DEBUG=true npm run dev

# Run single test with debugging
npm test -- --testNamePattern="specific test"

# Browser debugging (headed mode)
HEADLESS=false npm run dev
```

### Common Issues

**Tests failing locally but passing in CI?**
- Check Node.js version compatibility
- Verify browser installation
- Check for timing issues in tests

**Browser automation not working?**
- Verify Playwright browser installation
- Check if site selectors have changed
- Ensure network connectivity

**TypeScript compilation errors?**
- Run `npm run build` to see detailed errors
- Check import paths and types
- Ensure all dependencies are installed

## Contributing Guidelines

### Commit Messages
Follow conventional commits:
```
feat: add support for new retro format
fix: handle browser timeout errors  
test: add unit tests for config builder
docs: update README with new options
```

### Pull Request Process
1. Create feature branch from main
2. Write tests first (TDD)
3. Implement feature
4. Ensure all tests pass
5. Update documentation
6. Submit PR with clear description

### Code Review Checklist
- ✅ Tests cover new functionality
- ✅ SOLID principles followed
- ✅ Error handling implemented
- ✅ Types are properly defined
- ✅ Documentation updated
- ✅ No console.log statements left
