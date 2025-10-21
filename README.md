# Auto Surf - Interactive Browser Automation Builder

🤖 **Build browser automation workflows interactively!** This tool provides an interactive CLI for creating Playwright automation scripts step-by-step, plus a pre-built retro creation tool for retrotool.io.

## � Prerequisites (First-Time Setup)

If you're new to Node.js development, follow these steps:

### 1. 🟢 Install Node.js
**Download and install Node.js (includes npm):**
- Visit [nodejs.org](https://nodejs.org)
- Download the **LTS version** (recommended for most users)
- Run the installer and follow the setup wizard
- ✅ **Verify installation**: Open terminal/command prompt and run:
  ```bash
  node --version
  npm --version
  ```
  You should see version numbers like `v20.x.x` and `10.x.x`

### 2. 📁 Get the Code
**Option A: Download ZIP**
- Click the green "Code" button on GitHub
- Select "Download ZIP"
- Extract to your desired folder

**Option B: Clone with Git** (if you have Git installed)
```bash
git clone https://github.com/kv2461/auto-surf-prototype.git
cd auto-surf-prototype
```

### 3. 📂 Navigate to Project
Open terminal/command prompt and navigate to the project folder:
```bash
# Windows
cd C:\path\to\auto-surf-prototype

# Mac/Linux  
cd /path/to/auto-surf-prototype
```

## �🚀 Quick Start

Once you have Node.js installed and are in the project folder:

```bash
# Install project dependencies
npm install

# Install browser binaries (Playwright)
npx playwright install

# Start the interactive workflow builder
npm run interactive

# Or use the pre-built retro creator
npm run create-retro
```

### 🚨 Troubleshooting First Run

**"npm not found" or "command not found":**
- Node.js wasn't installed properly
- Restart your terminal after installing Node.js
- Try running `where npm` (Windows) or `which npm` (Mac/Linux)

**"Permission denied" errors:**
- **Windows**: Run terminal as Administrator
- **Mac/Linux**: Try `sudo npm install` (not recommended, better to fix npm permissions)

**Playwright installation issues:**
- Run `npx playwright install --force` to reinstall browsers
- On some systems, you may need: `npx playwright install-deps`

## 🎯 Interactive Workflow Builder

The main feature is the **interactive CLI** that guides you through building browser automation workflows:

```bash
npm run interactive
```

### Step-by-Step Guide

#### 1. 🌐 **Start with a URL**
The tool first asks for a website URL to navigate to:
```
🌐 Enter URL to navigate to: https://example.com
```
- Enter any valid URL (http:// or https://)
- The tool automatically navigates to this page first

#### 2. 📋 **Choose Your Actions**
After entering the URL, you get a menu of automation actions:

```
What would you like to do next?
1. ⏳ Wait for page load
2. ⏱️  Wait (milliseconds) 
3. 📝 Click text
4. 🔘 Click button
5. 🎯 Click element (selector)
6. ⌨️  Type text
7. 🔑 Press key
8. 📄 Generate script
9. ▶️  Execute workflow
0. 🚪 Exit
```

#### 3. 🛠️ **Action Details**

**⏳ Wait for Page Load (Option 1)**
- No input required
- Waits for network requests to finish
- Good for pages that load content dynamically

**⏱️ Wait (Option 2)**
- Prompts: `Enter wait time in milliseconds: 2000`
- Pauses execution for specified time
- Useful for animations or slow-loading elements

**📝 Click Text (Option 3)**
- Prompts: `Enter text to click: Sign In`
- Finds and clicks any element containing that text
- Best for buttons or links with visible text

**🔘 Click Button (Option 4)**
- Prompts: `Enter button text to click: Submit`
- Specifically targets button elements with that text
- More precise than "Click text" for buttons

**🎯 Click Element (Option 5)**
- Prompts: `Enter CSS selector to click: #submit-btn`
- Uses CSS selectors for precise targeting
- Examples: `#id`, `.class`, `[data-test="value"]`

**⌨️ Type Text (Option 6)**
- Prompts: `Enter text to type: Hello World`
- Types text into the currently focused input
- Simulates real typing with delays

**🔑 Press Key (Option 7)**
- Prompts: `Enter key to press: Enter`
- Simulates keyboard key presses
- Examples: `Enter`, `Tab`, `Escape`, `Control+A`

#### 4. 📄 **Generate Script (Option 8)**
Creates a TypeScript file in the `temp/` folder:
```typescript
import { BrowserWorkflowBuilder } from '../src/builder/BrowserWorkflowBuilder.js';

async function runWorkflow() {
  const builder = new BrowserWorkflowBuilder()
    .setLaunchOptions({ headless: false, slowMo: 1000 })
    .navigate('https://example.com')
    .waitForLoad()
    .clickText('Get started')
    .typeText('Hello World')
    .pressKey('Enter')

  const result = await builder.execute('Workflow completed successfully');
  console.log(result);
}

runWorkflow().catch(console.error);
```

#### 5. ▶️ **Execute Workflow (Option 9)**
- Runs your workflow immediately
- Opens a real browser window
- Shows success/failure results

## 🎪 Example Interactive Session

```
🤖 Interactive Browser Workflow Builder
=====================================

🌐 Enter URL to navigate to: https://retrotool.io
✅ Added: Navigate to https://retrotool.io

Current Workflow:
1. 🌐 Navigate to: https://retrotool.io

What would you like to do next?
> Choose 1 (Wait for page load)
✅ Added: Wait for page load

> Choose 3 (Click text) 
📝 Enter text to click: Liked | Learned | Lacked
✅ Added: Click text "Liked | Learned | Lacked"

> Choose 4 (Click button)
🔘 Enter button text to click: Create Retro
✅ Added: Click button "Create Retro"

> Choose 8 (Generate script)
📄 Generated script: generated-workflow-1729123456789.ts
```

## 🏃‍♂️ Pre-Built Retro Creator

For quick retro creation, use the pre-built command:

```bash
# Create retro with default settings
npm run create-retro

# Create retro with custom title  
npm run create-retro title:"Sprint Review"

# Create retro with different template
npm run create-retro template:madsadglad
```

**Supported Templates:**
- **Default**: Liked | Learned | Lacked  
- `madsadglad`: Mad | Sad | Glad

## 🧪 Testing

```bash
# Run unit tests (no browser windows)
npm test

# Run integration tests (opens browsers)
npm run test:retro

# Run all tests
npm run test:all
```

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run interactive` | **Main feature** - Interactive workflow builder |
| `npm run create-retro` | Pre-built retro creation tool |
| `npm test` | Unit tests only (fast, no browsers) |
| `npm run test:retro` | Integration tests (opens browsers) |
| `npm run build` | Compile TypeScript |

## 💡 Tips & Best Practices

**🎯 Selector Tips:**
- Use `text=` for exact text matches: `text=Submit`
- Use `button:has-text()` for buttons: `button:has-text("Sign Up")`
- Use CSS selectors for precise targeting: `#login-form button`
- Use data attributes for reliable testing: `[data-testid="submit"]`

**⏱️ Timing Tips:**
- Use "Wait for page load" after navigation
- Add small waits (1000-2000ms) for animations  
- Press Tab to move between form fields
- Use Enter to submit forms

**📄 Script Generation:**
- Scripts are saved to `temp/` folder (git-ignored)
- Each script is standalone and runnable
- Generated scripts use the `BrowserWorkflowBuilder` pattern

## 🏗️ Architecture

Built with a modular, testable architecture:
- **Actions**: Individual automation steps (`ClickAction`, `TypeAction`, etc.)
- **Builder**: Fluent API for chaining actions (`BrowserWorkflowBuilder`)  
- **Interactive CLI**: User-friendly workflow creation interface
- **Comprehensive Testing**: 98+ tests covering all functionality

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md) - Technical design and structure
- [Development](./docs/DEVELOPMENT.md) - Setup and contributing guide  
- [Testing Strategy](./docs/TESTING.md) - Testing approach and principles

---

🚀 **Get Started**: `npm run interactive` and build your first automation workflow!


