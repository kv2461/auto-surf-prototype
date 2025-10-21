import { Page } from 'playwright';
import { WebAction } from './WebAction';

export class WaitAction implements WebAction {
  constructor(private condition: 'networkidle' | number = 'networkidle') {}
  
  async execute(page: Page): Promise<void> {
    if (typeof this.condition === 'number') {
      await new Promise(resolve => setTimeout(resolve, this.condition as number));
    } else {
      await page.waitForLoadState(this.condition);
    }
  }
}