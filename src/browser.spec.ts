import { RetroAutomation } from './browser';

// Mock Playwright
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn().mockResolvedValue({
      close: jest.fn().mockResolvedValue(undefined)
    })
  }
}));

import { chromium } from 'playwright';
const mockChromium = chromium as jest.Mocked<typeof chromium>;

describe('RetroAutomation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance', () => {
    const automation = new RetroAutomation();
    expect(automation).toBeDefined();
  });

  it('should have openBrowser method that returns a Promise', async () => {
    const automation = new RetroAutomation();
    const result = automation.openBrowser();
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toContain('Starting script...');
  });

  it('should use Playwright chromium.launch when opening browser', async () => {
    const automation = new RetroAutomation();
    await automation.openBrowser();
    
    expect(mockChromium.launch).toHaveBeenCalledWith({ headless: false });
  });
});
