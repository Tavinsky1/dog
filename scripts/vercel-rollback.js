#!/usr/bin/env node

/**
 * Vercel Rollback Helper Script
 * 
 * Usage:
 *   node scripts/vercel-rollback.js              # Interactive mode
 *   node scripts/vercel-rollback.js <url>        # Direct rollback
 *   npm run vercel:rollback                      # Via package.json
 * 
 * This script helps you quickly rollback to a previous Vercel deployment.
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function exec(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    if (!silent) console.log(output);
    return output;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🔄 Vercel Rollback Helper\n');

  // Check if deployment URL provided as argument
  const deploymentArg = process.argv[2];

  if (deploymentArg) {
    // Direct rollback mode
    console.log(`🎯 Rolling back to: ${deploymentArg}\n`);
    const confirm = await ask('⚠️  Are you sure? This will affect production! (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Rollback cancelled');
      rl.close();
      return;
    }

    exec(`vercel rollback ${deploymentArg}`);
    console.log('\n✅ Rollback complete!');
    rl.close();
    return;
  }

  // Interactive mode - show recent deployments
  console.log('📋 Fetching recent deployments...\n');
  const deployments = exec('vercel ls --json', true);
  
  let parsed;
  try {
    parsed = JSON.parse(deployments);
  } catch (e) {
    console.error('❌ Failed to parse deployments. Make sure Vercel CLI is installed and authenticated.');
    console.error('Run: npm install -g vercel && vercel login');
    rl.close();
    process.exit(1);
  }

  if (!parsed || !parsed.deployments || parsed.deployments.length === 0) {
    console.error('❌ No deployments found');
    rl.close();
    process.exit(1);
  }

  // Show recent production deployments
  const prodDeployments = parsed.deployments
    .filter(d => d.target === 'production' && d.state === 'READY')
    .slice(0, 10);

  if (prodDeployments.length === 0) {
    console.error('❌ No production deployments found');
    rl.close();
    process.exit(1);
  }

  console.log('📦 Recent Production Deployments:\n');
  prodDeployments.forEach((d, i) => {
    const date = new Date(d.created).toLocaleString();
    const url = d.url || d.alias?.[0] || d.id;
    console.log(`  ${i + 1}. ${url}`);
    console.log(`     Created: ${date}`);
    console.log(`     State: ${d.state} | ${d.creator?.username || 'unknown'}\n`);
  });

  const choice = await ask('\nEnter deployment number to rollback to (or "cancel"): ');

  if (choice.toLowerCase() === 'cancel') {
    console.log('❌ Rollback cancelled');
    rl.close();
    return;
  }

  const index = parseInt(choice) - 1;
  if (isNaN(index) || index < 0 || index >= prodDeployments.length) {
    console.error('❌ Invalid choice');
    rl.close();
    process.exit(1);
  }

  const selected = prodDeployments[index];
  const deploymentUrl = selected.url || selected.alias?.[0] || selected.id;

  console.log(`\n🎯 Selected: ${deploymentUrl}`);
  console.log(`   Created: ${new Date(selected.created).toLocaleString()}\n`);

  const confirm = await ask('⚠️  Are you sure? This will affect production! (yes/no): ');
  
  if (confirm.toLowerCase() !== 'yes') {
    console.log('❌ Rollback cancelled');
    rl.close();
    return;
  }

  console.log('\n🔄 Rolling back...\n');
  exec(`vercel rollback ${deploymentUrl}`);
  
  console.log('\n✅ Rollback complete!');
  console.log(`\n📊 Verify at: https://${deploymentUrl}`);
  console.log('\n💡 Tip: If you need to undo this, run the script again.');
  
  rl.close();
}

main().catch(error => {
  console.error('❌ Error:', error);
  rl.close();
  process.exit(1);
});
