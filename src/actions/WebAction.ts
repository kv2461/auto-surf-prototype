import { Page } from 'playwright';

export interface WebAction {
  execute(page: Page): Promise<void>;
}