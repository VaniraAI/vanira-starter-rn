const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const outPath = path.join(root, 'src/config/env.generated.ts');

const KEYS = ['VANIRA_AGENT_ID', 'VANIRA_API_KEY', 'VANIRA_BACKEND_URL'];

function parseEnv(content) {
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

if (!fs.existsSync(envPath)) {
  console.error('Missing .env — copy .env.example to .env and fill in your credentials.');
  process.exit(1);
}

const env = parseEnv(fs.readFileSync(envPath, 'utf8'));

const lines = [
  '// Auto-generated from .env by scripts/sync-env.js — do not edit.',
  '// Re-run: npm run sync-env (also runs automatically before start/android/ios).',
  '',
];

for (const key of KEYS) {
  lines.push(`export const ${key} = ${JSON.stringify(env[key] ?? '')};`);
}

lines.push('');
fs.writeFileSync(outPath, lines.join('\n'));
console.log(`Synced ${KEYS.join(', ')} from .env`);
