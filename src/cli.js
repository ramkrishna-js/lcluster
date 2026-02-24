#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

if (!process.env.LCLUSTER_TSX_BOOTSTRAPPED) {
  process.env.LCLUSTER_TSX_BOOTSTRAPPED = '1';
  const __filename = fileURLToPath(import.meta.url);

  const result = spawnSync(process.execPath, [
    '--no-warnings',
    '--import',
    'tsx',
    __filename,
    ...process.argv.slice(2)
  ], {
    stdio: 'inherit'
  });

  process.exit(result.status ?? 0);
}

// Now we can safely import everything else because tsx loader is active
const { runCLI } = await import('./main.js');
await runCLI();
