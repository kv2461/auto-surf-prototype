import { chromium } from 'playwright';
import type { WebAction } from '../actions/WebAction';
import { NavigateAction } from '../actions/NavigateAction';
import { WaitAction } from '../actions/WaitAction';
import { ClickAction } from '../actions/ClickAction';
import { TypeAction } from '../actions/TypeAction';
import { KeyPressAction } from '../actions/KeyPressAction';

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
  
  undo(): WebAction | null {
    return this.actions.pop() || null;
  }
  
  async execute(successMessage?: string): Promise<string> {
    try {
      console.log('Attempting to launch browser...');
      const browser = await chromium.launch(this.launchOptions);
      console.log('Browser launched successfully!');
      
      const page = await browser.newPage();
      
      for (const action of this.actions) {
        await action.execute(page);
      }
      
      const currentUrl = page.url();
      await browser.close();
      console.log('Closing browser...');
      
      const message = successMessage || 'Successfully completed browser workflow';
      return `${message}: ${currentUrl}`;
    } catch (error) {
      console.error('Something unexpected happened:', error);
      throw error;
    }
  }
}