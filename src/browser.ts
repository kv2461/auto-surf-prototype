import { BrowserWorkflowBuilder } from './builder/BrowserWorkflowBuilder';

function createDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export class RetroAutomation {
  constructor() {
    // Minimal implementation to pass the test
  }

  async openBrowser(template?: string, customTitle?: string): Promise<string> {
    // Determine which template to use
    const templateText = template === 'madsadglad' ? 'Mad | Sad | Glad' : 'Liked | Learned | Lacked';
    
    // Create the title with date
    const baseTitle = customTitle || 'Retro';
    const newTitle = `${baseTitle} ${createDateString()}`;
    
    // Build and execute the workflow
    return new BrowserWorkflowBuilder()
      .navigate('https://retrotool.io/new-retrospective')
      .waitForLoad()
      .clickText(templateText, `Clicked on ${templateText} option`)
      .clickButton('Create Retro', 'Clicked Create Retro button')
      .waitForLoad()
      .clickElement('button[data-cy="value"]:has-text("Untitled retrospective")', 'Clicked on title to edit')
      .typeText(newTitle, true)
      .pressKey('Enter')
      .wait(5000)
      .execute();
  }
}
