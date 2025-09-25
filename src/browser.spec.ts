import { RetroAutomation } from './browser';

// Mock Playwright completely to avoid real browser launches
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn().mockResolvedValue({
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn().mockResolvedValue(undefined),
        url: jest.fn().mockReturnValue('https://retrotool.io/new-retrospective'),
        click: jest.fn().mockResolvedValue(undefined),
        waitForLoadState: jest.fn().mockResolvedValue(undefined),
        fill: jest.fn().mockResolvedValue(undefined),
        keyboard: {
          press: jest.fn().mockResolvedValue(undefined),
          type: jest.fn().mockResolvedValue(undefined)
        }
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
    await expect(result).resolves.toContain('Successfully generated retrotool:');
  });

  it('should use Playwright chromium.launch when opening browser', async () => {
    const automation = new RetroAutomation();
    await automation.openBrowser();
    
    expect(mockChromium.launch).toHaveBeenCalledWith({ 
      headless: false,
      slowMo: 1000 
    });
  });

  it('should navigate to retrotool.io/new-retrospective after opening browser', async () => {
    const automation = new RetroAutomation();
    await automation.openBrowser();
    
    // Get the mock page instance to verify goto was called with retrotool.io/new-retrospective
    const mockBrowser = await mockChromium.launch();
    const mockPage = await mockBrowser.newPage();
    expect(mockPage.goto).toHaveBeenCalledWith('https://retrotool.io/new-retrospective');
  });

  it('should return the URL of the last website visited before closing', async () => {
    const automation = new RetroAutomation();
    const result = await automation.openBrowser();
    expect(result).toContain('https://retrotool.io/new-retrospective');
  });

  it('should click on Liked | Learned | Lacked box and Create Retro button', async () => {
    const automation = new RetroAutomation();
    await automation.openBrowser();
    
    // Get the mock page instance to verify clicks were made
    const mockBrowser = await mockChromium.launch();
    const mockPage = await mockBrowser.newPage();
    expect(mockPage.waitForLoadState).toHaveBeenCalledWith('networkidle');
    expect(mockPage.click).toHaveBeenCalledWith('text=Liked | Learned | Lacked');
    expect(mockPage.click).toHaveBeenCalledWith('button:has-text("Create Retro")');
  });

  it('should click on Mad | Sad | Glad box when template is madsadglad', async () => {
    const automation = new RetroAutomation();
    await automation.openBrowser('madsadglad');
    
    // Get the mock page instance to verify clicks were made
    const mockBrowser = await mockChromium.launch();
    const mockPage = await mockBrowser.newPage();
    expect(mockPage.waitForLoadState).toHaveBeenCalledWith('networkidle');
    expect(mockPage.click).toHaveBeenCalledWith('text=Mad | Sad | Glad');
    expect(mockPage.click).toHaveBeenCalledWith('button:has-text("Create Retro")');
  });

  it('should edit the title to include current date after creating retrospective', async () => {
    const automation = new RetroAutomation();
    await automation.openBrowser();
    
    // Get the mock page instance to verify title editing
    const mockBrowser = await mockChromium.launch();
    const mockPage = await mockBrowser.newPage();
    
    // Should click on the "Untitled retrospective" button with data-cy="value"
    expect(mockPage.click).toHaveBeenCalledWith('button[data-cy="value"]:has-text("Untitled retrospective")');
    
    // Should select all text and type the new title
    expect(mockPage.keyboard.press).toHaveBeenCalledWith('Control+A');
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd format
    expect(mockPage.keyboard.type).toHaveBeenCalledWith(`Retro ${today}`);
  });

  it('should use custom title when title parameter is provided', async () => {
    const automation = new RetroAutomation();
    await automation.openBrowser(undefined, 'Team Retro');
    
    // Get the mock page instance to verify custom title
    const mockBrowser = await mockChromium.launch();
    const mockPage = await mockBrowser.newPage();
    
    // Should click on the "Untitled retrospective" button with data-cy="value"
    expect(mockPage.click).toHaveBeenCalledWith('button[data-cy="value"]:has-text("Untitled retrospective")');
    
    // Should type custom title with date
    expect(mockPage.keyboard.press).toHaveBeenCalledWith('Control+A');
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd format
    expect(mockPage.keyboard.type).toHaveBeenCalledWith(`Team Retro ${today}`);
  });

  it('should use both custom template and title when both parameters are provided', async () => {
    const automation = new RetroAutomation();
    await automation.openBrowser('madsadglad', 'Team Retro');
    
    // Get the mock page instance to verify both template and title
    const mockBrowser = await mockChromium.launch();
    const mockPage = await mockBrowser.newPage();
    
    // Should click on Mad | Sad | Glad template
    expect(mockPage.click).toHaveBeenCalledWith('text=Mad | Sad | Glad');
    
    // Should type custom title with date
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd format
    expect(mockPage.keyboard.type).toHaveBeenCalledWith(`Team Retro ${today}`);
  });
});
