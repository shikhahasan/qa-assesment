// Runs the Postman collection with Newman and always writes an HTML report.
//
//   node scripts/run-api.mjs [any newman run args]
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const shell = process.platform === 'win32';
mkdirSync('reports', { recursive: true });

const result = spawnSync(
  'npx',
  [
    'newman',
    'run',
    'api/JSONPlaceholder.postman_collection.json',
    '-r',
    'cli,htmlextra',
    '--reporter-htmlextra-export',
    'reports/api-report.html',
    '--reporter-htmlextra-title',
    'JSONPlaceholder API Tests',
    ...process.argv.slice(2),
  ],
  { stdio: 'inherit', shell },
);

console.log('\nAPI report → reports/api-report.html');
process.exit(result.status ?? 1);
