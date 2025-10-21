import { Page } from 'playwright';
import { WebAction } from './WebAction';

export class ClickAction implements WebAction {
  constructor(private selector: string, private description?: string) {}
  
  async execute(page: Page): Promise<void> {
    await page.click(this.selector);
    if (this.description) {
      console.log(this.description);
    }
  }
}