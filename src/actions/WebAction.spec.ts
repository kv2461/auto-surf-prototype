import { Page } from 'playwright';
import type { WebAction } from './WebAction';

class TestWebAction implements WebAction {
  constructor(private testValue: string) {}
  
  async execute(page: Page): Promise<void> {
    await page.evaluate(() => console.log('test'));
  }
}

describe('WebAction', () => {
  it('should be implementable by classes with execute method', () => {
    const testAction = new TestWebAction('test');
    expect(testAction).toBeDefined();
    expect(typeof testAction.execute).toBe('function');
  });

  it('should have execute method that accepts Page and returns Promise<void>', async () => {
    const testAction = new TestWebAction('test');
    const mockPage = {
      evaluate: jest.fn().mockResolvedValue(undefined)
    } as unknown as Page;
    
    const result = testAction.execute(mockPage);
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toBeUndefined();
  });
});