import { Page } from 'playwright';
import { WaitAction } from './WaitAction';

describe('WaitAction', () => {
  let mockPage: jest.Mocked<Page>;

  beforeEach(() => {
    mockPage = {
      waitForLoadState: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<Page>;
  });

  it('should create an instance with default networkidle condition', () => {
    const action = new WaitAction();
    expect(action).toBeDefined();
  });

  it('should create an instance with networkidle condition', () => {
    const action = new WaitAction('networkidle');
    expect(action).toBeDefined();
  });

  it('should create an instance with numeric timeout', () => {
    const action = new WaitAction(1000);
    expect(action).toBeDefined();
  });

  const networkIdleTestCases = [
    { 
      testLabel: 'default networkidle',
      condition: undefined, 
      expectsPageCall: true
    },
    { 
      testLabel: 'explicit networkidle',
      condition: 'networkidle' as const,
      expectsPageCall: true
    }
  ];

  networkIdleTestCases.forEach(({ testLabel, condition, expectsPageCall }) => {
    it(`should handle ${testLabel} waiting`, async () => {
      const action = condition !== undefined 
        ? new WaitAction(condition)
        : new WaitAction(); 
      await action.execute(mockPage);
      
      if (expectsPageCall) {
        expect(mockPage.waitForLoadState).toHaveBeenCalledWith('networkidle');
      }
    });
  });

  const timeoutTestCases = [
    { 
      testLabel: 'short timeout',
      timeout: 100
    },
    { 
      testLabel: 'medium timeout',
      timeout: 1000
    },
    { 
      testLabel: 'long timeout',
      timeout: 2000
    },
    { 
      testLabel: 'zero timeout',
      timeout: 0
    }
  ];

  timeoutTestCases.forEach(({ testLabel, timeout }) => {
    it(`should handle ${testLabel} (${timeout}ms)`, async () => {
      const action = new WaitAction(timeout);
      
      const startTime = Date.now();
      await action.execute(mockPage);
      const endTime = Date.now();
      const elapsed = endTime - startTime;
      
      expect(mockPage.waitForLoadState).not.toHaveBeenCalled();
      
      if (timeout > 0) {
        expect(elapsed).toBeGreaterThanOrEqual(timeout - 50); 
        expect(elapsed).toBeLessThan(timeout + 100); 
      } else {
        expect(elapsed).toBeLessThan(50); 
      }
    });
  });

  it('should not call waitForLoadState when using numeric timeout', async () => {
    const action = new WaitAction(10);
    
    await action.execute(mockPage);
    
    expect(mockPage.waitForLoadState).not.toHaveBeenCalled();
  });

  it('should call waitForLoadState when using networkidle', async () => {
    const action = new WaitAction('networkidle');
    
    await action.execute(mockPage);
    
    expect(mockPage.waitForLoadState).toHaveBeenCalledWith('networkidle');
  });

  it('should handle different load states if supported', async () => {
    // Note: Currently only 'networkidle' is supported, but testing the pattern
    const action = new WaitAction('networkidle');
    
    await action.execute(mockPage);
    
    expect(mockPage.waitForLoadState).toHaveBeenCalledWith('networkidle');
  });

  it('should work with various timeout values', async () => {
    const timeoutValues = [1, 50, 100, 500, 1000, 2000];

    for (const timeout of timeoutValues) {
      const action = new WaitAction(timeout);
      const startTime = Date.now();
      
      await action.execute(mockPage);
      
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(timeout - 50);
      expect(mockPage.waitForLoadState).not.toHaveBeenCalled();
    }
  });
});