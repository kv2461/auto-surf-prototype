# Testing Strategy

## Testing Philosophy

This project follows **Test-Driven Development (TDD)** principles:
- Write tests first, then implement functionality
- Small, focused units with clear responsibilities
- Heavy use of mocks for external dependencies
- Follow SOLID principles to make testing easier

## Testing Framework: Jest

### Why Jest?
- Excellent mocking capabilities
- Built-in code coverage
- Easy setup with TypeScript
- Great developer experience
- Familiar syntax

### Test Structure

```typescript
// Example test structure
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should handle specific scenario', () => {
      // Arrange
      const input = createTestInput();
      const mockDependency = createMockDependency();
      
      // Act
      const result = componentMethod(input, mockDependency);
      
      // Assert
      expect(result).toEqual(expectedOutput);
      expect(mockDependency.method).toHaveBeenCalledWith(expectedArgs);
    });
  });
});
```

## Test Categories

### 1. Unit Tests
Test individual functions and classes in isolation.

#### ConfigBuilder Tests
- ✅ Default configuration building
- ✅ Custom title handling
- ✅ Date inclusion/exclusion
- ✅ Format validation
- ✅ Error handling for invalid formats

#### Browser Tests (Mocked)
- Browser initialization with different options
- Browser lifecycle management
- Error handling for browser failures
- Screenshot capture functionality

#### Navigation Tests (Mocked)
- Site navigation flow
- Element selection and interaction
- Format selection automation
- Timeout and retry logic

### 2. Integration Tests
Test how components work together.

#### CLI Integration
- End-to-end argument parsing
- Configuration building from CLI options
- Error messaging and user feedback

#### Browser + Navigation Integration
- Full retro creation workflow
- Cross-browser compatibility testing
- Error recovery scenarios

### 3. Contract Tests
Ensure external dependencies work as expected.

#### Playwright Contracts
- Browser automation API stability
- Element selector reliability
- Page navigation timing

#### retrotool.io Interface
- Site structure expectations
- Form interaction patterns
- URL generation behavior

## Testing Best Practices

### Mocking Strategy

```typescript
// Mock external dependencies
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn().mockResolvedValue(mockBrowser)
  }
}));

// Mock date-fns for consistent date testing
jest.mock('date-fns', () => ({
  format: jest.fn().mockReturnValue('2025-09-24')
}));
```

### Test Data Management

```typescript
// Test builders for consistent test data
class TestConfigBuilder {
  static buildValidOptions(): CLIOptions {
    return {
      title: 'Test Retro',
      format: 'liked-learned-lacked'
    };
  }
  
  static buildInvalidOptions(): CLIOptions {
    return {
      format: 'invalid-format'
    };
  }
}
```

### Coverage Goals
- **Statements**: 95%+
- **Branches**: 90%+
- **Functions**: 95%+
- **Lines**: 95%+

### Test Commands

```bash
# Run all tests
npm test

# Watch mode for TDD
npm run test:watch

# Coverage report
npm run test:coverage
```

## TDD Workflow

### Red-Green-Refactor Cycle

1. **Red**: Write a failing test first
   ```bash
   npm run test:watch
   # Write test -> See it fail
   ```

2. **Green**: Write minimal code to make it pass
   ```typescript
   // Implement just enough to pass the test
   ```

3. **Refactor**: Improve code while keeping tests green
   ```typescript
   // Clean up, apply SOLID principles
   ```

### Example TDD Session

```typescript
// 1. RED: Write failing test
describe('ConfigBuilder', () => {
  it('should build config with custom title', () => {
    const config = ConfigBuilder.buildConfig({ title: 'Custom' });
    expect(config.title).toMatch(/Custom - \d{4}-\d{2}-\d{2}/);
  });
});

// 2. GREEN: Make it pass
class ConfigBuilder {
  static buildConfig(options: CLIOptions): RetroConfig {
    return {
      title: `${options.title} - 2025-09-24`,
      // ... minimal implementation
    };
  }
}

// 3. REFACTOR: Improve implementation
class ConfigBuilder {
  static buildConfig(options: CLIOptions): RetroConfig {
    const title = this.buildTitle(options.title, !options.noDate);
    // ... proper implementation with extracted methods
  }
}
```

## Continuous Integration

### GitHub Actions (Planned)
- Run tests on every commit
- Generate coverage reports
- Fail builds on coverage drops
- Cross-platform testing (Windows, macOS, Linux)

### Pre-commit Hooks (Planned)
- Run tests before commits
- Ensure code formatting
- Type checking with TypeScript

## Testing Anti-Patterns to Avoid

❌ **Don't test implementation details**
```typescript
// Bad: testing internal method calls
expect(configBuilder.parseFormat).toHaveBeenCalled();
```

✅ **Do test behavior and outputs**
```typescript
// Good: testing the actual result
expect(config.format).toBe('liked-learned-lacked');
```

❌ **Don't write overly complex tests**
❌ **Don't mock everything (mock boundaries, not internals)**
❌ **Don't ignore failing tests**
❌ **Don't write tests after the code (breaks TDD)**

## Mock Boundaries

### What to Mock
- External APIs (retrotool.io)
- Browser automation (Playwright)
- File system operations
- Date/time functions
- Network requests

### What NOT to Mock
- Internal business logic
- Pure functions
- Type definitions
- Configuration objects

This testing strategy ensures high-quality, maintainable code while following TDD principles and SOLID design patterns.
