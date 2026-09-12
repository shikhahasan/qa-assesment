import { spawnSync } from 'node:child_process';

const shell = process.platform === 'win32';

console.log('\n=== UI tests (Part A) ===');
const ui = spawnSync('npx', ['playwright', 'test'], { stdio: 'inherit', shell }).status ?? 1;

console.log('\n=== API tests (Part D) ===');
const api = spawnSync(process.execPath, ['scripts/run-api.mjs'], { stdio: 'inherit' }).status ?? 1;

console.log('\n=== Result ===');
console.log('UI tests :', ui === 0 ? 'PASSED' : 'FAILED');
console.log('API tests:', api === 0 ? 'PASSED' : 'FAILED');

process.exit(ui || api ? 1 : 0);
