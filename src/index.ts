import { RetroAutomation } from './browser.js';

async function main() {
  // Parse command line arguments for format
  const args = process.argv.slice(2);
  let format: string | undefined;
  
  for (const arg of args) {
    if (arg.startsWith('format:')) {
      format = arg.split(':')[1];
      break;
    }
  }
  
  const automation = new RetroAutomation();
  const result = await automation.openBrowser(format);
  console.log(result);
}

main().catch(console.error);
