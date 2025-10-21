#!/usr/bin/env node

import { BrowserWorkflowBuilder } from './builder/BrowserWorkflowBuilder.js';
import * as readline from 'readline';
import fs from 'fs';
import path from 'path';

interface Step {
  type: string;
  value?: string;
  description?: string;
}

class InteractiveBrowserBuilder {
  private rl: readline.Interface;
  private builder: BrowserWorkflowBuilder;
  private steps: Step[] = [];

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.builder = new BrowserWorkflowBuilder();
  }

  async start() {
    console.log('🤖 Interactive Browser Workflow Builder');
    console.log('=====================================\n');
    
    await this.getUrl();
  }

  private async getUrl(): Promise<void> {
    const url = await this.question('🌐 Enter URL to navigate to: ');
    if (url.trim()) {
      this.builder.navigate(url.trim());
      this.steps.push({ type: 'navigate', value: url.trim() });
      console.log(`✅ Added: Navigate to ${url.trim()}\n`);
    }
    await this.showMenu();
  }

  private async showMenu(): Promise<void> {
    console.log('Current Workflow:');
    this.steps.forEach((step, index) => {
      console.log(`${index + 1}. ${this.formatStep(step)}`);
    });
    console.log('');

    console.log('What would you like to do next?');
    console.log('1. 🌐 Navigate to URL');
    console.log('2. ⏳ Wait for page load');
    console.log('3. ⏱️  Wait (milliseconds)');
    console.log('4. 📝 Click text');
    console.log('5. 🔘 Click button');
    console.log('6. 🎯 Click element (selector)');
    console.log('7. ⌨️  Type text');
    console.log('8. 🔑 Press key');
    console.log('9. ↩️  Undo last action');
    console.log('10. 📄 Generate script');
    console.log('11. ▶️  Execute workflow');
    console.log('0. 🚪 Exit');

    const choice = await this.question('\nEnter your choice (0-11): ');
    await this.handleChoice(choice.trim());
  }

  private async handleChoice(choice: string): Promise<void> {
    switch (choice) {
      case '1':
        const url = await this.question('🌐 Enter URL to navigate to: ');
        if (url.trim()) {
          this.builder.navigate(url.trim());
          this.steps.push({ type: 'navigate', value: url.trim() });
          console.log(`✅ Added: Navigate to ${url.trim()}\n`);
        }
        break;
      
      case '2':
        this.builder.waitForLoad();
        this.steps.push({ type: 'waitForLoad', description: 'Wait for page load' });
        console.log('✅ Added: Wait for page load\n');
        break;
      
      case '3':
        const ms = await this.question('⏱️  Enter wait time in milliseconds: ');
        const waitTime = parseInt(ms.trim());
        if (waitTime > 0) {
          this.builder.wait(waitTime);
          this.steps.push({ type: 'wait', value: ms.trim(), description: `Wait ${ms.trim()}ms` });
          console.log(`✅ Added: Wait ${ms.trim()}ms\n`);
        }
        break;

      case '4':
        const text = await this.question('📝 Enter text to click: ');
        if (text.trim()) {
          this.builder.clickText(text.trim());
          this.steps.push({ type: 'clickText', value: text.trim(), description: `Click text: "${text.trim()}"` });
          console.log(`✅ Added: Click text "${text.trim()}"\n`);
        }
        break;

      case '5':
        const buttonText = await this.question('🔘 Enter button text to click: ');
        if (buttonText.trim()) {
          this.builder.clickButton(buttonText.trim());
          this.steps.push({ type: 'clickButton', value: buttonText.trim(), description: `Click button: "${buttonText.trim()}"` });
          console.log(`✅ Added: Click button "${buttonText.trim()}"\n`);
        }
        break;

      case '6':
        const selector = await this.question('🎯 Enter CSS selector to click: ');
        if (selector.trim()) {
          this.builder.clickElement(selector.trim());
          this.steps.push({ type: 'clickElement', value: selector.trim(), description: `Click element: ${selector.trim()}` });
          console.log(`✅ Added: Click element ${selector.trim()}\n`);
        }
        break;

      case '7':
        const typeText = await this.question('⌨️  Enter text to type: ');
        if (typeText.trim()) {
          this.builder.typeText(typeText.trim());
          this.steps.push({ type: 'typeText', value: typeText.trim(), description: `Type: "${typeText.trim()}"` });
          console.log(`✅ Added: Type "${typeText.trim()}"\n`);
        }
        break;

      case '8':
        const key = await this.question('🔑 Enter key to press (e.g., Enter, Tab, Escape): ');
        if (key.trim()) {
          this.builder.pressKey(key.trim());
          this.steps.push({ type: 'pressKey', value: key.trim(), description: `Press key: ${key.trim()}` });
          console.log(`✅ Added: Press key ${key.trim()}\n`);
        }
        break;

      case '9':
        await this.undoLastAction();
        break;

      case '10':
        await this.generateScript();
        break;

      case '11':
        await this.executeWorkflow();
        break;

      case '0':
        console.log('👋 Goodbye!');
        this.rl.close();
        return;

      default:
        console.log('❌ Invalid choice. Please try again.\n');
        break;
    }

    if (choice !== '0' && choice !== '10' && choice !== '11') {
      await this.showMenu();
    }
  }

  private async undoLastAction(): Promise<void> {
    if (this.steps.length === 0) {
      console.log('❌ No actions to undo.\n');
      return;
    }

    const lastStep = this.steps.pop();
    const undoneAction = this.builder.undo();
    
    if (lastStep && undoneAction) {
      console.log(`↩️  Undone: ${this.formatStep(lastStep)}`);
      
      // Special handling for undoing the initial navigation
      if (lastStep.type === 'navigate' && this.steps.length === 0) {
        console.log('⚠️  Warning: You have undone the initial navigation. You may want to add a new navigation step.\n');
      } else {
        console.log('');
      }
    } else {
      console.log('❌ Failed to undo last action.\n');
    }
  }

  private async generateScript(): Promise<void> {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate TypeScript script
    const scriptContent = this.generateTypeScriptScript();
    const fileName = `generated-workflow-${Date.now()}.ts`;
    const filePath = path.join(tempDir, fileName);
    
    fs.writeFileSync(filePath, scriptContent);
    
    console.log(`\n📄 Generated script: ${fileName}`);
    console.log(`📁 Location: ${filePath}`);
    console.log('\n📋 Script content:');
    console.log('─'.repeat(50));
    console.log(scriptContent);
    console.log('─'.repeat(50));
    
    const continueChoice = await this.question('\nWould you like to continue building? (y/n): ');
    if (continueChoice.toLowerCase().startsWith('y')) {
      await this.showMenu();
    } else {
      this.rl.close();
    }
  }

  private generateTypeScriptScript(): string {
    let script = `import { BrowserWorkflowBuilder } from '../src/builder/BrowserWorkflowBuilder.js';

async function runWorkflow() {
  const builder = new BrowserWorkflowBuilder()
    .setLaunchOptions({ headless: false, slowMo: 1000 })`;

    // Add each step as a chained method call
    this.steps.forEach(step => {
      switch (step.type) {
        case 'navigate':
          script += `\n    .navigate('${step.value}')`;
          break;
        case 'waitForLoad':
          script += `\n    .waitForLoad()`;
          break;
        case 'wait':
          script += `\n    .wait(${step.value})`;
          break;
        case 'clickText':
          script += `\n    .clickText('${step.value}')`;
          break;
        case 'clickButton':
          script += `\n    .clickButton('${step.value}')`;
          break;
        case 'clickElement':
          script += `\n    .clickElement('${step.value}')`;
          break;
        case 'typeText':
          script += `\n    .typeText('${step.value}')`;
          break;
        case 'pressKey':
          script += `\n    .pressKey('${step.value}')`;
          break;
      }
    });

    script += `\n\n  const result = await builder.execute('Workflow completed successfully');
  console.log(result);
}

runWorkflow().catch(console.error);
`;

    return script;
  }

  private async executeWorkflow(): Promise<void> {
    console.log('\n🚀 Executing workflow...\n');
    
    try {
      const result = await this.builder.execute('Interactive workflow completed successfully');
      console.log('\n✅ Workflow executed successfully!');
      console.log(`📊 Result: ${result}\n`);
    } catch (error) {
      console.log('\n❌ Workflow execution failed!');
      console.error(`🔥 Error: ${error}\n`);
    }

    const continueChoice = await this.question('Would you like to continue building? (y/n): ');
    if (continueChoice.toLowerCase().startsWith('y')) {
      await this.showMenu();
    } else {
      this.rl.close();
    }
  }

  private formatStep(step: Step): string {
    switch (step.type) {
      case 'navigate':
        return `🌐 Navigate to: ${step.value}`;
      case 'waitForLoad':
        return '⏳ Wait for page load';
      case 'wait':
        return `⏱️  Wait ${step.value}ms`;
      case 'clickText':
        return `📝 Click text: "${step.value}"`;
      case 'clickButton':
        return `🔘 Click button: "${step.value}"`;
      case 'clickElement':
        return `🎯 Click element: ${step.value}`;
      case 'typeText':
        return `⌨️  Type: "${step.value}"`;
      case 'pressKey':
        return `🔑 Press key: ${step.value}`;
      default:
        return step.description || 'Unknown step';
    }
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }
}

// Run the interactive builder
const app = new InteractiveBrowserBuilder();
app.start().catch(console.error);