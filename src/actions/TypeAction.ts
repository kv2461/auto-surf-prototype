import { Page } from 'playwright';
import { WebAction } from './WebAction';

export class TypeAction implements WebAction {
  constructor(private text: string, private selectAll: boolean = false) {}
  
  async execute(page: Page): Promise<void> {
    if (this.selectAll) {
      await page.keyboard.press('Control+A');
    }
    await page.keyboard.type(this.text);
    console.log(`Typed: ${this.text}`);
  }
}