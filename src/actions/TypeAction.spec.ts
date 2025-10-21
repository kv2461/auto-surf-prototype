import { Page } from 'playwright';
import { TypeAction } from './TypeAction';

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('TypeAction', () => {
  let mockPage: jest.Mocked<Page>;

  beforeEach(() => {
    mockPage = {
      keyboard: {
        press: jest.fn().mockResolvedValue(undefined),
        type: jest.fn().mockResolvedValue(undefined)
      }
    } as unknown as jest.Mocked<Page>;
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('should create an instance with text', () => {
    const action = new TypeAction('hello world');
    expect(action).toBeDefined();
  });

  it('should create an instance with text and selectAll flag', () => {
    const action = new TypeAction('hello world', true);
    expect(action).toBeDefined();
  });

  const typeTestCases = [
    { 
      testLabel: 'simple text',
      text: 'Hello World',
      selectAll: false
    },
    { 
      testLabel: 'email address',
      text: 'user@example.com',
      selectAll: false
    },
    { 
      testLabel: 'password with special chars',
      text: 'MyP@ssw0rd!',
      selectAll: false
    },
    { 
      testLabel: 'multiline text',
      text: 'Line 1\nLine 2\nLine 3',
      selectAll: false
    },
    { 
      testLabel: 'text with spaces and numbers',
      text: 'Retro 2025-10-20',
      selectAll: false
    },
    { 
      testLabel: 'empty string',
      text: '',
      selectAll: false
    }
  ];

  typeTestCases.forEach(({ testLabel, text, selectAll }) => {
    it(`should type ${testLabel}: "${text}"`, async () => {
      const action = new TypeAction(text, selectAll);
      
      await action.execute(mockPage);
      
      expect(mockPage.keyboard.type).toHaveBeenCalledWith(text);
      expect(mockConsoleLog).toHaveBeenCalledWith(`Typed: ${text}`);
    });
  });

  const selectAllTestCases = [
    { 
      testLabel: 'with selectAll true',
      text: 'New Title',
      selectAll: true,
      shouldCallCtrlA: true
    },
    { 
      testLabel: 'with selectAll false',
      text: 'Additional Text',
      selectAll: false,
      shouldCallCtrlA: false
    },
    { 
      testLabel: 'with selectAll default (false)',
      text: 'Default Behavior',
      selectAll: undefined, 
      shouldCallCtrlA: false
    }
  ];

  selectAllTestCases.forEach(({ testLabel, text, selectAll, shouldCallCtrlA }) => {
    it(`should handle selectAll behavior ${testLabel}`, async () => {
      const action = selectAll !== undefined 
        ? new TypeAction(text, selectAll)
        : new TypeAction(text); 
      
      await action.execute(mockPage);
      
      if (shouldCallCtrlA) {
        expect(mockPage.keyboard.press).toHaveBeenCalledWith('Control+A');
      } else {
        expect(mockPage.keyboard.press).not.toHaveBeenCalled();
      }
      
      expect(mockPage.keyboard.type).toHaveBeenCalledWith(text);
    });
  });

  it('should call keyboard.press before keyboard.type when selectAll is true', async () => {
    const action = new TypeAction('Test Text', true);
    
    await action.execute(mockPage);
    
    expect(mockPage.keyboard.press).toHaveBeenCalledWith('Control+A');
    expect(mockPage.keyboard.type).toHaveBeenCalledWith('Test Text');
  });

  it('should handle special characters and unicode', async () => {
    const specialTexts = [
      '🎉 Unicode emoji',
      'Accénted tëxt',
      '中文字符',
      '<script>alert("test")</script>',
      'Tab\tSpaced\tText'
    ];

    for (const text of specialTexts) {
      const action = new TypeAction(text);
      await action.execute(mockPage);
      expect(mockPage.keyboard.type).toHaveBeenCalledWith(text);
      expect(mockConsoleLog).toHaveBeenCalledWith(`Typed: ${text}`);
    }
  });
});