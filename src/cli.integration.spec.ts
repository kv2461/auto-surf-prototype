describe('CLI', () => {
  it('should successfully create a retrospective and navigate away from new-retrospective page', async () => {
    const { execSync } = require('child_process');
    const output = execSync('npm run create-retro', { encoding: 'utf-8' });
    
    // Should contain a retrotool.io URL
    expect(output).toMatch(/https:\/\/retrotool\.io\/\w+/);
    
    // Should NOT still be on the new-retrospective page (meaning creation succeeded)
    expect(output).not.toContain('https://retrotool.io/new-retrospective');
    
    // Should contain success indicators
    expect(output).toContain('Successfully generated retrotool:');
    expect(output).toContain('https://retrotool.io/');
  });
});
