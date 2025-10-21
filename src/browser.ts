import { chromium, Browser, Page } from 'playwright';
import type { WebAction } from './actions/WebAction';
import { NavigateAction } from './actions/NavigateAction';
import { WaitAction } from './actions/WaitAction';
import { ClickAction } from './actions/ClickAction';
import { TypeAction } from './actions/TypeAction';
import { KeyPressAction } from './actions/KeyPressAction';

// Builder class for constructing browser automation workflows
export class BrowserWorkflowBuilder {
  private actions: WebAction[] = [];
  private launchOptions = { headless: false, slowMo: 1000 };
  
  navigate(url: string): this {
    this.actions.push(new NavigateAction(url));
    return this;
  }
  
  waitForLoad(): this {
    this.actions.push(new WaitAction('networkidle'));
    return this;
  }
  
  wait(ms: number): this {
    this.actions.push(new WaitAction(ms));
    return this;
  }
  
  clickText(text: string, description?: string): this {
    this.actions.push(new ClickAction(`text=${text}`, description));
    return this;
  }
  
  clickButton(text: string, description?: string): this {
    this.actions.push(new ClickAction(`button:has-text("${text}")`, description));
    return this;
  }
  
  clickElement(selector: string, description?: string): this {
    this.actions.push(new ClickAction(selector, description));
    return this;
  }
  
  typeText(text: string, selectAll: boolean = false): this {
    this.actions.push(new TypeAction(text, selectAll));
    return this;
  }
  
  pressKey(key: string): this {
    this.actions.push(new KeyPressAction(key));
    return this;
  }
  
  setLaunchOptions(options: { headless?: boolean; slowMo?: number }): this {
    this.launchOptions = { ...this.launchOptions, ...options };
    return this;
  }
  
  async execute(): Promise<string> {
    try {
      console.log('Attempting to launch browser...');
      const browser = await chromium.launch(this.launchOptions);
      console.log('Browser launched successfully!');
      
      const page = await browser.newPage();
      
      // Execute all actions in sequence
      for (const action of this.actions) {
        await action.execute(page);
      }
      
      const currentUrl = page.url();
      await browser.close();
      console.log('Closing browser...');
      
      return `Successfully generated retrotool: ${currentUrl}`;
    } catch (error) {
      console.error('Something unexpected happened:', error);
      throw error;
    }
  }
}

// Utility function to create a formatted date string
function createDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Original RetroAutomation class - refactored to use the builder pattern
export class RetroAutomation {
  constructor() {
    // Minimal implementation to pass the test
  }

  async openBrowser(template?: string, customTitle?: string): Promise<string> {
    // Determine which template to use
    const templateText = template === 'madsadglad' ? 'Mad | Sad | Glad' : 'Liked | Learned | Lacked';
    
    // Create the title with date
    const baseTitle = customTitle || 'Retro';
    const newTitle = `${baseTitle} ${createDateString()}`;
    
    // Build and execute the workflow
    return new BrowserWorkflowBuilder()
      .navigate('https://retrotool.io/new-retrospective')
      .waitForLoad()
      .clickText(templateText, `Clicked on ${templateText} option`)
      .clickButton('Create Retro', 'Clicked Create Retro button')
      .waitForLoad()
      .clickElement('button[data-cy="value"]:has-text("Untitled retrospective")', 'Clicked on title to edit')
      .typeText(newTitle, true)
      .pressKey('Enter')
      .wait(5000)
      .execute();
  }
}
