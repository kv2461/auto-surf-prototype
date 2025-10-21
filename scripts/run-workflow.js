#!/usr/bin/env node

import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const tempDir = join(projectRoot, 'temp');

async function findWorkflows() {
  try {
    const files = await readdir(tempDir);
    return files
      .filter(file => file.startsWith('generated-workflow-') && file.endsWith('.ts'))
      .map(file => ({
        name: file,
        path: join(tempDir, file),
        // Extract the number from the filename for matching
        number: file.match(/generated-workflow-(\d+)\.ts$/)?.[1] || ''
      }));
  } catch (error) {
    console.error('❌ Could not read temp directory:', error.message);
    return [];
  }
}

function fuzzyMatch(query, workflows) {
  const lowerQuery = query.toLowerCase();
  
  // First try exact number match
  const exactMatch = workflows.find(w => w.number === query);
  if (exactMatch) return { type: 'exact', workflow: exactMatch };
  
  // Then try partial number matches - but check for ambiguity
  const partialMatches = workflows.filter(w => w.number.includes(query));
  if (partialMatches.length === 1) {
    return { type: 'partial', workflow: partialMatches[0] };
  } else if (partialMatches.length > 1) {
    return { type: 'ambiguous', matches: partialMatches, query };
  }
  
  // Then try filename matches - but check for ambiguity
  const filenameMatches = workflows.filter(w => w.name.toLowerCase().includes(lowerQuery));
  if (filenameMatches.length === 1) {
    return { type: 'filename', workflow: filenameMatches[0] };
  } else if (filenameMatches.length > 1) {
    return { type: 'ambiguous', matches: filenameMatches, query };
  }
  
  return { type: 'none' };
}

function showAvailableWorkflows(workflows) {
  console.log('\n📋 Available workflows:');
  workflows.forEach((workflow, index) => {
    const shortNumber = workflow.number.slice(-6); // Last 6 digits for display
    console.log(`   ${index + 1}. ${workflow.name} (match: ${shortNumber})`);
  });
  console.log('');
}

async function runWorkflow(workflowPath) {
  console.log(`🚀 Running workflow: ${workflowPath}\n`);
  
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['tsx', workflowPath], {
      stdio: 'inherit',
      shell: true,
      cwd: projectRoot
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Workflow completed successfully!');
        resolve();
      } else {
        console.log(`\n❌ Workflow failed with exit code ${code}`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.error('❌ Failed to start workflow:', error.message);
      reject(error);
    });
  });
}

async function main() {
  const query = process.argv[2];
  
  if (!query) {
    console.log('🤖 Workflow Runner with Fuzzy Matching');
    console.log('=====================================');
    console.log('\nUsage: npm run workflow <query>');
    console.log('\nExamples:');
    console.log('  npm run workflow 403     # Match by partial number');
    console.log('  npm run workflow 1761    # Match by partial number'); 
    console.log('  npm run workflow chess   # Match by filename content');
    
    const workflows = await findWorkflows();
    if (workflows.length > 0) {
      showAvailableWorkflows(workflows);
    } else {
      console.log('\n❌ No workflows found in temp/ directory');
    }
    process.exit(1);
  }

  const workflows = await findWorkflows();
  
  if (workflows.length === 0) {
    console.log('❌ No workflows found in temp/ directory');
    process.exit(1);
  }

  const matchResult = fuzzyMatch(query, workflows);
  
  if (matchResult.type === 'none') {
    console.log(`❌ No workflow found matching: "${query}"`);
    showAvailableWorkflows(workflows);
    process.exit(1);
  }
  
  if (matchResult.type === 'ambiguous') {
    console.log(`⚠️  Ambiguous match for "${query}". Multiple workflows found:`);
    matchResult.matches.forEach((workflow, index) => {
      const shortNumber = workflow.number.slice(-6);
      console.log(`   ${index + 1}. ${workflow.name} (match: ${shortNumber})`);
    });
    console.log('\n💡 Please be more specific with your query.');
    process.exit(1);
  }

  const workflow = matchResult.workflow;
  console.log(`🎯 Found match: ${workflow.name}`);
  await runWorkflow(workflow.path);
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});