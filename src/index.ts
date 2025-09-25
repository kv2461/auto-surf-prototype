import { RetroAutomation } from './browser.js';

async function main() {
  const automation = new RetroAutomation();
  const result = await automation.openBrowser();
  console.log(result);
}

main().catch(console.error);
