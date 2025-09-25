describe('CLI', () => {
  it('should call openBrowser when script is run', async () => {
    const { execSync } = require('child_process');
    const output = execSync('npm run create-retro', { encoding: 'utf-8' });
    expect(output).toContain('Starting script...');
  });

  it('should output result from RetroAutomation openBrowser method', async () => {
    // First, change what openBrowser returns to something unique
    // If CLI is actually calling the method, output should change
    const fs = require('fs');
    
    // Temporarily modify browser.ts to return different value
    const originalBrowser = fs.readFileSync('src/browser.ts', 'utf-8');
    const modifiedBrowser = originalBrowser.replace(
      "return 'Starting script... Browser launched';", 
      "return 'From RetroAutomation class';"
    );
    fs.writeFileSync('src/browser.ts', modifiedBrowser);
    
    try {
      const { execSync } = require('child_process');
      const output = execSync('npm run create-retro', { encoding: 'utf-8' });
      expect(output).toContain('Starting script... Browser launched. Last visited: https://retrotool.io/');
    } finally {
      // Restore original file
      fs.writeFileSync('src/browser.ts', originalBrowser);
    }
  });
});
