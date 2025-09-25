describe('CLI', () => {
  it('should call openBrowser when script is run', async () => {
    // This will fail because we don't have a CLI script yet
    const { execSync } = require('child_process');
    const output = execSync('npm run dev', { encoding: 'utf-8' });
    expect(output).toContain('Hello world');
  });
});
