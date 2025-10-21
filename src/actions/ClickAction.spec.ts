import { Page } from 'playwright';
import { ClickAction } from './ClickAction';

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('ClickAction', () => {
  let mockPage: jest.Mocked<Page>;

  beforeEach(() => {
    mockPage = {
      click: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<Page>;
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('should create an instance with selector', () => {
    const action = new ClickAction('button');
    expect(action).toBeDefined();
  });

  it('should create an instance with selector and description', () => {
    const action = new ClickAction('button', 'Click the submit button');
    expect(action).toBeDefined();
  });

  const selectorTestCases = [
    { 
      testLabel: 'tag selector',
      selector: 'button', 
      description: 'Click submit button'
    },
    { 
      testLabel: 'ID selector',
      selector: '#login-btn', 
      description: 'Click login button'
    },
    { 
      testLabel: 'class selector',
      selector: '.btn-primary', 
      description: 'Click primary button'
    },
    { 
      testLabel: 'text-based selector',
      selector: 'button:has-text("Create Retro")', 
      description: 'Click Create Retro button'
    },
    { 
      testLabel: 'attribute selector',
      selector: 'button[data-cy="value"]', 
      description: 'Click data-cy button'
    },
    { 
      testLabel: 'Playwright text selector',
      selector: 'text=Liked | Learned | Lacked', 
      description: 'Click template option'
    }
  ];

  selectorTestCases.forEach(({ testLabel, selector, description }) => {
    it(`should handle ${testLabel}: ${selector}`, async () => {
      const action = new ClickAction(selector, description);
      
      await action.execute(mockPage);
      
      expect(mockPage.click).toHaveBeenCalledWith(selector);
    });
  });

  selectorTestCases.forEach(({ selector, description }) => {
    it(`should log description when provided for selector: ${selector}`, async () => {
      const action = new ClickAction(selector, description);
      
      await action.execute(mockPage);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(description);
    });
  });

  it('should not log when no description is provided', async () => {
    const action = new ClickAction('button');
    
    await action.execute(mockPage);
    
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it('should handle complex selectors', async () => {
    const complexSelectors = [
      'div > button.primary:nth-child(2)',
      'form[name="login"] input[type="submit"]',
      'button:has-text("Submit"):visible',
      '[data-testid="confirm-button"]:enabled'
    ];

    for (const selector of complexSelectors) {
      const action = new ClickAction(selector, `Clicking ${selector}`);
      await action.execute(mockPage);
      expect(mockPage.click).toHaveBeenCalledWith(selector);
    }
  });
});