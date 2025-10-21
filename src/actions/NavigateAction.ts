import { Page } from 'playwright';
import { WebAction } from './WebAction';

export class NavigateAction implements WebAction {
  constructor(private url: string) {}
  
  async execute(page: Page): Promise<void> {
    await page.goto(this.url);
    console.log(`Navigated to retrotool website`);
  }
}