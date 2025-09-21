#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

try {
  require.resolve('eslint');
} catch (error) {
  console.warn('⚠️  eslint is not installed. Skipping lint step.');
  process.exit(0);
}

const nextBin = path.join('node_modules', 'next', 'dist', 'bin', 'next');
const result = spawnSync('node', [nextBin, 'lint'], { stdio: 'inherit' });
process.exit(result.status ?? 1);
