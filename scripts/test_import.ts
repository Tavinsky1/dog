// scripts/test_import.ts
import path from 'path';
import { promises as fs } from 'fs';

async function test() {
  console.log('Testing import dependencies...');
  
  try {
    // Test path module
    const dataDir = path.join(process.cwd(), 'data');
    console.log('Data directory path:', dataDir);
    
    // Test fs module
    try {
      await fs.access(dataDir);
      console.log('Data directory exists');
    } catch {
      console.log('Data directory does not exist');
    }
    
    console.log('Basic modules working correctly');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
