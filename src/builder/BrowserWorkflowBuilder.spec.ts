import { BrowserWorkflowBuilder } from './BrowserWorkflowBuilder';
import { NavigateAction } from '../actions/NavigateAction';
import { WaitAction } from '../actions/WaitAction';
import { ClickAction } from '../actions/ClickAction';
import { TypeAction } from '../actions/TypeAction';
import { KeyPressAction } from '../actions/KeyPressAction';

jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn().mockResolvedValue({
      newPage: jest.fn().mockResolvedValue({
        url: jest.fn().mockReturnValue('https://example.com/final'),
        goto: jest.fn(),
        click: jest.fn(),
        type: jest.fn(),
        fill: jest.fn(),
        keyboard: {
          press: jest.fn()
        },
        waitForTimeout: jest.fn(),
        waitForLoadState: jest.fn()
      }),
      close: jest.fn()
    })
  }
}));

jest.mock('../actions/NavigateAction');
jest.mock('../actions/WaitAction');
jest.mock('../actions/ClickAction');
jest.mock('../actions/TypeAction');
jest.mock('../actions/KeyPressAction');

describe('BrowserWorkflowBuilder', () => {
  let builder: BrowserWorkflowBuilder;
  let mockChromium: any;
  let mockBrowser: any;
  let mockPage: any;

  beforeEach(() => {
    builder = new BrowserWorkflowBuilder();
    
    jest.clearAllMocks();
    
    mockPage = {
      url: jest.fn().mockReturnValue('https://example.com/final'),
      goto: jest.fn(),
      click: jest.fn(),
      type: jest.fn(),
      fill: jest.fn(),
      keyboard: {
        press: jest.fn()
      },
      waitForTimeout: jest.fn(),
      waitForLoadState: jest.fn()
    };

    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn()
    };

    const { chromium } = require('playwright');
    mockChromium = chromium;
    mockChromium.launch.mockResolvedValue(mockBrowser);
    
    (NavigateAction as jest.MockedClass<typeof NavigateAction>).mockImplementation(() => ({
      execute: jest.fn()
    } as any));
    
    (WaitAction as jest.MockedClass<typeof WaitAction>).mockImplementation(() => ({
      execute: jest.fn()
    } as any));
    
    (ClickAction as jest.MockedClass<typeof ClickAction>).mockImplementation(() => ({
      execute: jest.fn()
    } as any));
    
    (TypeAction as jest.MockedClass<typeof TypeAction>).mockImplementation(() => ({
      execute: jest.fn()
    } as any));
    
    (KeyPressAction as jest.MockedClass<typeof KeyPressAction>).mockImplementation(() => ({
      execute: jest.fn()
    } as any));
  });

  describe('Fluent API Methods', () => {
    it('should return this for fluent chaining - navigate', () => {
      const result = builder.navigate('https://example.com');
      expect(result).toBe(builder);
    });

    it('should return this for fluent chaining - waitForLoad', () => {
      const result = builder.waitForLoad();
      expect(result).toBe(builder);
    });

    it('should return this for fluent chaining - wait', () => {
      const result = builder.wait(1000);
      expect(result).toBe(builder);
    });

    it('should return this for fluent chaining - clickText', () => {
      const result = builder.clickText('Submit');
      expect(result).toBe(builder);
    });

    it('should return this for fluent chaining - clickButton', () => {
      const result = builder.clickButton('Submit');
      expect(result).toBe(builder);
    });

    it('should return this for fluent chaining - clickElement', () => {
      const result = builder.clickElement('#submit');
      expect(result).toBe(builder);
    });

    it('should return this for fluent chaining - typeText', () => {
      const result = builder.typeText('Hello World');
      expect(result).toBe(builder);
    });

    it('should return this for fluent chaining - pressKey', () => {
      const result = builder.pressKey('Enter');
      expect(result).toBe(builder);
    });

    it('should return this for fluent chaining - setLaunchOptions', () => {
      const result = builder.setLaunchOptions({ headless: true });
      expect(result).toBe(builder);
    });
  });

  describe('Action Creation', () => {
    it('should create NavigateAction when navigate is called', () => {
      builder.navigate('https://example.com');
      
      expect(NavigateAction).toHaveBeenCalledWith('https://example.com');
    });

    it('should create WaitAction for network idle when waitForLoad is called', () => {
      builder.waitForLoad();
      
      expect(WaitAction).toHaveBeenCalledWith('networkidle');
    });

    it('should create WaitAction for timeout when wait is called', () => {
      builder.wait(5000);
      
      expect(WaitAction).toHaveBeenCalledWith(5000);
    });

    it('should create ClickAction with text selector when clickText is called', () => {
      builder.clickText('Submit', 'Click submit button');
      
      expect(ClickAction).toHaveBeenCalledWith('text=Submit', 'Click submit button');
    });

    it('should create ClickAction with button selector when clickButton is called', () => {
      builder.clickButton('Submit', 'Click submit button');
      
      expect(ClickAction).toHaveBeenCalledWith('button:has-text("Submit")', 'Click submit button');
    });

    it('should create ClickAction with custom selector when clickElement is called', () => {
      builder.clickElement('#submit-btn', 'Click custom element');
      
      expect(ClickAction).toHaveBeenCalledWith('#submit-btn', 'Click custom element');
    });

    it('should create TypeAction when typeText is called', () => {
      builder.typeText('Hello World', true);
      
      expect(TypeAction).toHaveBeenCalledWith('Hello World', true);
    });

    it('should create TypeAction with default selectAll false when typeText is called without selectAll', () => {
      builder.typeText('Hello World');
      
      expect(TypeAction).toHaveBeenCalledWith('Hello World', false);
    });

    it('should create KeyPressAction when pressKey is called', () => {
      builder.pressKey('Enter');
      
      expect(KeyPressAction).toHaveBeenCalledWith('Enter');
    });
  });

  describe('Launch Options', () => {
    it('should merge launch options with defaults', async () => {
      builder
        .setLaunchOptions({ headless: true })
        .navigate('https://example.com');
      
      await builder.execute();
      
      expect(mockChromium.launch).toHaveBeenCalledWith({
        headless: true,
        slowMo: 1000
      });
    });

    it('should merge multiple launch options', async () => {
      builder
        .setLaunchOptions({ headless: true })
        .setLaunchOptions({ slowMo: 500 })
        .navigate('https://example.com');
      
      await builder.execute();
      
      expect(mockChromium.launch).toHaveBeenCalledWith({
        headless: true,
        slowMo: 500
      });
    });

    it('should use default launch options when none are set', async () => {
      builder.navigate('https://example.com');
      
      await builder.execute();
      
      expect(mockChromium.launch).toHaveBeenCalledWith({
        headless: false,
        slowMo: 1000
      });
    });
  });

  describe('Workflow Execution', () => {
    it('should execute all actions in sequence', async () => {
      const navigateAction = { execute: jest.fn() };
      const clickAction = { execute: jest.fn() };
      const typeAction = { execute: jest.fn() };

      (NavigateAction as jest.MockedClass<typeof NavigateAction>).mockImplementationOnce(() => navigateAction as any);
      (ClickAction as jest.MockedClass<typeof ClickAction>).mockImplementationOnce(() => clickAction as any);
      (TypeAction as jest.MockedClass<typeof TypeAction>).mockImplementationOnce(() => typeAction as any);

      builder
        .navigate('https://example.com')
        .clickText('Submit')
        .typeText('Hello');

      await builder.execute();

      expect(navigateAction.execute).toHaveBeenCalledWith(mockPage);
      expect(clickAction.execute).toHaveBeenCalledWith(mockPage);
      expect(typeAction.execute).toHaveBeenCalledWith(mockPage);
    });

    it('should return success message with current URL', async () => {
      builder.navigate('https://example.com');
      
      const result = await builder.execute('Custom success message');
      
      expect(result).toBe('Custom success message: https://example.com/final');
    });

    it('should return default success message when none provided', async () => {
      builder.navigate('https://example.com');
      
      const result = await builder.execute();
      
      expect(result).toBe('Successfully completed browser workflow: https://example.com/final');
    });

    it('should close browser after execution', async () => {
      builder.navigate('https://example.com');
      
      await builder.execute();
      
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should handle execution errors and rethrow', async () => {
      const error = new Error('Browser launch failed');
      mockChromium.launch.mockRejectedValueOnce(error);
      
      builder.navigate('https://example.com');
      
      await expect(builder.execute()).rejects.toThrow('Browser launch failed');
    });
  });

  describe('Complex Workflow Chains', () => {
    it('should build complex workflows with method chaining', () => {
      const result = builder
        .setLaunchOptions({ headless: true })
        .navigate('https://example.com')
        .waitForLoad()
        .clickText('Login')
        .typeText('username')
        .pressKey('Tab')
        .typeText('password')
        .clickButton('Submit')
        .wait(2000);

      expect(result).toBe(builder);
      expect(NavigateAction).toHaveBeenCalledWith('https://example.com');
      expect(WaitAction).toHaveBeenCalledWith('networkidle');
      expect(ClickAction).toHaveBeenCalledWith('text=Login', undefined);
      expect(TypeAction).toHaveBeenCalledWith('username', false);
      expect(KeyPressAction).toHaveBeenCalledWith('Tab');
      expect(TypeAction).toHaveBeenCalledWith('password', false);
      expect(ClickAction).toHaveBeenCalledWith('button:has-text("Submit")', undefined);
      expect(WaitAction).toHaveBeenCalledWith(2000);
    });

    it('should handle empty workflow execution', async () => {
      const result = await builder.execute();
      
      expect(result).toBe('Successfully completed browser workflow: https://example.com/final');
      expect(mockChromium.launch).toHaveBeenCalled();
      expect(mockBrowser.close).toHaveBeenCalled();
    });
  });

  describe('Console Logging', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log browser launch and close messages', async () => {
      builder.navigate('https://example.com');
      
      await builder.execute();
      
      expect(consoleSpy).toHaveBeenCalledWith('Attempting to launch browser...');
      expect(consoleSpy).toHaveBeenCalledWith('Browser launched successfully!');
      expect(consoleSpy).toHaveBeenCalledWith('Closing browser...');
    });
  });
});