import { RetroAutomation } from './browser';

// Mock Playwright completely to avoid real browser launches
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn().mockResolvedValue({
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn().mockResolvedValue(undefined)
      }),
      close: jest.fn().mockResolvedValue(undefined)
    })
  }
}));

// Mock console.log to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn()
};

// Mock setTimeout to make tests fast
jest.mock('timers');

import { chromium } from 'playwright';
const mockChromium = chromium as jest.Mocked<typeof chromium>;

describe('RetroAutomation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Make setTimeout resolve immediately
    jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
      callback();
      return {} as NodeJS.Timeout;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    
    expect(mockChromium.launch).toHaveBeenCalledWith({ 
      headless: false,
      slowMo: 1000 
    });
  });
});
