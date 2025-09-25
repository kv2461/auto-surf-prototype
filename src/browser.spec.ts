import { RetroAutomation } from './browser';

describe('RetroAutomation', () => {
  it('should create an instance', () => {
    const automation = new RetroAutomation();
    expect(automation).toBeDefined();
  });

  it('should have openBrowser method that returns a Promise', async () => {
    const automation = new RetroAutomation();
    const result = automation.openBrowser();
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toBe('Starting script...');
  });
});
