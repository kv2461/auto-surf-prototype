#!/usr/bin/env node

import { RetroAutomation } from './createRetro.js';

async function main() {
  // Parse command line arguments for template and title
  const args = process.argv.slice(2);
  let template: string | undefined;
  let customTitle: string | undefined;
  
  for (const arg of args) {
    if (arg.startsWith('template:')) {
      template = arg.split(':')[1];
    } else if (arg.startsWith('title:')) {
      // Handle quoted titles like title:"Team Retro"
      const titlePart = arg.split(':')[1];
      customTitle = titlePart.replace(/^"(.*)"$/, '$1'); // Remove quotes if present
    }
  }
  
  const automation = new RetroAutomation();
  const result = await automation.openBrowser(template, customTitle);
  console.log(result);
}

main().catch(console.error);
