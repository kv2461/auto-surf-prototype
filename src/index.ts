import { RetroAutomation } from './browser.js';

async function main() {
  // Parse command line arguments for format and title
  const args = process.argv.slice(2);
  let format: string | undefined;
  let customTitle: string | undefined;
  
  for (const arg of args) {
    if (arg.startsWith('format:')) {
      format = arg.split(':')[1];
    } else if (arg.startsWith('title:')) {
      // Handle quoted titles like title:"Team Retro"
      const titlePart = arg.split(':')[1];
      customTitle = titlePart.replace(/^"(.*)"$/, '$1'); // Remove quotes if present
    }
  }
  
  const automation = new RetroAutomation();
  const result = await automation.openBrowser(format, customTitle);
  console.log(result);
}

main().catch(console.error);
