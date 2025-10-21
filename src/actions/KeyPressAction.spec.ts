import { Page } from 'playwright';
import { KeyPressAction } from './KeyPressAction';

describe('KeyPressAction', () => {
  let mockPage: jest.Mocked<Page>;

  beforeEach(() => {
    mockPage = {
      keyboard: {
        press: jest.fn().mockResolvedValue(undefined)
      }
    } as unknown as jest.Mocked<Page>;
  });

  it('should create an instance with key', () => {
    const action = new KeyPressAction('Enter');
    expect(action).toBeDefined();
  });

  it('should call page.keyboard.press with the provided key', async () => {
    const action = new KeyPressAction('Enter');
    
    await action.execute(mockPage);
    
    expect(mockPage.keyboard.press).toHaveBeenCalledWith('Enter');
  });

  it('should work with any key string', async () => {
    const testKeys = ['Escape', 'Control+A', 'F5', ' ', 'ArrowUp'];
    
    for (const key of testKeys) {
      const action = new KeyPressAction(key);
      await action.execute(mockPage);
      expect(mockPage.keyboard.press).toHaveBeenCalledWith(key);
    }
  });
});