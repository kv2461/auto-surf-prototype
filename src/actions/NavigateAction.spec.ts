import { Page } from 'playwright';
import { NavigateAction } from './NavigateAction';

// Mock console.log to capture output
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('NavigateAction', () => {
  let mockPage: jest.Mocked<Page>;

  beforeEach(() => {
    mockPage = {
      goto: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<Page>;
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('should create an instance with URL', () => {
    const action = new NavigateAction('https://example.com');
    expect(action).toBeDefined();
  });

  // Parametrized tests for different URLs
  const testCases = [
    { url: 'https://example.com', description: 'example' },
    { url: 'http://localhost:3000', description: 'localhost' },
    { url: 'https://retrotool.io/new-retrospective', description: 'retrotool' },
    { url: 'https://github.com/user/repo', description: 'github' },
    { url: 'https://stackoverflow.com/questions', description: 'stackoverflow' }
  ];

  testCases.forEach(({ url, description }) => {
    it(`should navigate to ${description} (${url})`, async () => {
      const action = new NavigateAction(url);
      
      await action.execute(mockPage);
      
      expect(mockPage.goto).toHaveBeenCalledWith(url);
    });
  });

  testCases.forEach(({ url, description }) => {
    it(`should log navigation message for ${url}`, async () => {
      const action = new NavigateAction(url);
      
      await action.execute(mockPage);
      
      // Currently logs hardcoded message, but test verifies it logs something
      expect(mockConsoleLog).toHaveBeenCalledWith(`Navigated to ${description} website`);
    });
  });

  it('should handle any URL format with goto call', async () => {
    const testUrls = [
      'https://example.com',
      'http://localhost:3000',
      'https://retrotool.io/different-page',
      'file:///path/to/file.html'
    ];

    for (const url of testUrls) {
      const action = new NavigateAction(url);
      await action.execute(mockPage);
      expect(mockPage.goto).toHaveBeenCalledWith(url);
    }
  });
});