# Architecture Documentation

## Technology Stack

- **Language**: TypeScript (type safety and modern async/await)
- **Browser Automation**: Playwright (superior reliability and API)
- **CLI Framework**: Commander.js (feature-rich CLI toolkit)
- **Date Handling**: date-fns (lightweight, functional utilities)
- **Testing**: Jest (comprehensive testing with mocks)
- **Runtime**: Node.js with tsx for direct TypeScript execution

## Project Structure

```
prototype/
├── README.md              # Quick start and overview
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── src/
│   ├── index.ts           # Main entry point and CLI setup
│   ├── config.ts          # Configuration builder (SOLID)
│   ├── browser.ts         # Browser automation logic
│   ├── navigation.ts      # Site navigation handlers
│   └── types.ts           # Type definitions
├── tests/
│   ├── setup.ts           # Jest global setup
│   └── *.test.ts          # Unit tests
└── docs/
    ├── ARCHITECTURE.md    # This file
    ├── DEVELOPMENT.md     # Development guide
    └── TESTING.md         # Testing strategy
```

## Core Components

### ConfigBuilder (SOLID Principles)
- **Single Responsibility**: Only builds configuration objects
- **Open/Closed**: Extensible for new formats without modification
- **Dependency Inversion**: Uses injected date formatting

```typescript
class ConfigBuilder {
  static buildConfig(options: CLIOptions): RetroConfig
  static parseFormat(format?: string): RetroFormat
  static buildTitle(title?: string, includeDate?: boolean): string
}
```

### Browser Manager
- Initialize Playwright browser with optimal settings
- Handle browser lifecycle management
- Support multiple browser types (Chromium, Firefox, WebKit)
- Smart headless/headed mode selection

### Navigation Controller
- Site-specific navigation logic with robust selectors
- Element interaction with built-in retry logic
- Format selection automation with type safety
- Screenshot capture for debugging

### CLI Handler
- Argument parsing with Commander.js
- Input validation with TypeScript types
- Progress indicators and status updates
- Structured error reporting

## Design Principles

### SOLID Principles Applied

1. **Single Responsibility Principle**
   - Each class has one reason to change
   - ConfigBuilder only handles configuration
   - Browser class only handles browser operations

2. **Open/Closed Principle**
   - New retro formats can be added without modifying existing code
   - New browser types can be supported via extension

3. **Liskov Substitution Principle**
   - Browser implementations are interchangeable
   - Format handlers follow same interface

4. **Interface Segregation Principle**
   - Small, focused interfaces
   - Clients only depend on methods they use

5. **Dependency Inversion Principle**
   - High-level modules don't depend on low-level modules
   - Both depend on abstractions (interfaces)

### Error Handling Strategy

```typescript
// Custom error types for specific scenarios
class RetroCreationError extends Error {}
class NavigationError extends Error {}
class ConfigurationError extends Error {}
```

#### Expected Scenarios
- Network connectivity issues
- Browser not found/accessible
- Site layout changes
- Element not found/clickable
- Timeout conditions

#### Recovery Mechanisms
- Retry logic for transient failures
- Fallback browser options
- Clear error messages with suggested actions
- Graceful degradation where possible

## Configuration Management

### Default Settings
- **Title Format**: "{title} - {date}" when date included
- **Date Format**: YYYY-MM-DD (ISO format)
- **Browser**: Chromium (most reliable for automation)
- **Timeout**: 30 seconds for page loads
- **Retro Format**: "liked-learned-lacked"

### Extensibility Points
- New retro format support
- Custom browser configurations  
- Additional CLI options
- Plugin architecture for custom sites

## Future Architecture Considerations

### Planned Enhancements
- Plugin system for custom retro sites
- Configuration file support (.retrorc.json)
- Multiple retro creation (batch processing)
- Template system for custom formats

### Scalability
- Modular design allows for easy feature addition
- Type system prevents breaking changes
- Comprehensive test coverage enables safe refactoring
