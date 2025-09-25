import { chromium } from 'playwright';

export class RetroAutomation {
  constructor() {
    // Minimal implementation to pass the test
  }

  async openBrowser(format?: string): Promise<string> {
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
      
      // Determine which format to click based on parameter
      let formatText = 'Liked | Learned | Lacked'; // default
      if (format === 'madsadglad') {
        formatText = 'Mad | Sad | Glad';
      }
      
      // Click on the selected format option
      await page.click(`text=${formatText}`);
      console.log(`Clicked on ${formatText} option`);
      
      // Click on Create Retro button
      await page.click('button:has-text("Create Retro")');
      console.log('Clicked Create Retro button');
      
      // Keep browser open for 5 seconds so you can see it
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log('Closing browser...');
      const currentUrl = page.url();
      await browser.close();
      return `Starting script... Browser launched. Last visited: ${currentUrl}`;
    } catch (error) {
      console.error('Failed to launch browser:', error);
      throw error;
    }
  }
}
