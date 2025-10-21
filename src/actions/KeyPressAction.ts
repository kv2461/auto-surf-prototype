import { Page } from 'playwright';
import { WebAction } from './WebAction';

export class KeyPressAction implements WebAction {
  constructor(private key: string) {}
  
  async execute(page: Page): Promise<void> {
    await page.keyboard.press(this.key);
  }
}