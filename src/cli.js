#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

if (!process.env.LCLUSTER_TSX_BOOTSTRAPPED) {
  process.env.LCLUSTER_TSX_BOOTSTRAPPED = '1';
  const __filename = fileURLToPath(import.meta.url);

  const result = spawnSync(process.execPath, [
    '--no-warnings',
    '--import',
    import.meta.resolve('tsx'),
    __filename,
    ...process.argv.slice(2)
  ], {
    stdio: 'inherit'
  });

  process.exit(result.status ?? 0);
}

// Now we can safely import everything else because tsx loader is active
import fs from 'node:fs';
import path from 'node:path';
const pkgPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// Beta Version Lockdown (Phase 10)
if (pkg.version.includes('-beta')) {
  // Determine if running from global node_modules by checking the path structure
  if (pkgPath.includes('node_modules') || process.execPath === process.argv[1]) {
    console.error('\n[Lcluster Error] Beta versions (v1.0.2-beta) cannot be run globally.\n');
    console.error('Please clone the repository and run locally via:');
    console.error('  git clone https://github.com/ramkrishna-js/lcluster.git');
    console.error('  cd lcluster && npm install && npm link\n');
    process.exit(1);
  }
}

const { runCLI } = await import('./main.js');
await runCLI();
