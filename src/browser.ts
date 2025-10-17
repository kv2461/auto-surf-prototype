import { chromium } from 'playwright';

export class RetroAutomation {
  constructor() {
    // Minimal implementation to pass the test
  }

  async openBrowser(template?: string, customTitle?: string): Promise<string> {
    try {
      console.log('Attempting to launch browser...');
      const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000 // Slow down actions to make it more visible
      });
      console.log('Browser launched successfully!');
      
      // Create a page and navigate to a website so you can see something
      const page = await browser.newPage();
      await page.goto('https://retrotool.io/new-retrospective');
      console.log('Navigated to retrotool.io/new-retrospective');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Determine which template to click based on parameter
      let templateText = 'Liked | Learned | Lacked'; // default
      if (template === 'madsadglad') {
        templateText = 'Mad | Sad | Glad';
      }
      
      // Click on the selected template option
      await page.click(`text=${templateText}`);
      console.log(`Clicked on ${templateText} option`);
      
      // Click on Create Retro button
      await page.click('button:has-text("Create Retro")');
      console.log('Clicked Create Retro button');
      
      // Wait for navigation to the new retrospective page
      await page.waitForLoadState('networkidle');
      
      // Edit the title to include current date
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; // yyyy-mm-dd format in local time
      const baseTitle = customTitle || 'Retro';
      const newTitle = `${baseTitle} ${today}`;
      
      // Click on the "Untitled retrospective" button to edit title
      await page.click('button[data-cy="value"]:has-text("Untitled retrospective")');
      console.log('Clicked on title to edit');
      
      // Clear existing text and type the new title
      await page.keyboard.press('Control+A'); // Select all
      await page.keyboard.type(newTitle);
      console.log(`Set title to: ${newTitle}`);
      await page.keyboard.press('Enter'); 

      
      // Keep browser open for 5 seconds so you can see it
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log('Closing browser...');
      const currentUrl = page.url();
      await browser.close();
      return `Successfully generated retrotool: ${currentUrl}`;
    } catch (error) {
      console.error('Something unexpected happened:', error);
      throw error;
    }
  }
}
