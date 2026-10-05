import { existsSync, readFileSync } from 'node:fs';
const limits = {
  'ai/PROJECT_BRAIN.md': { limit: 300, required: true },
  'ai/AGENT_INSTRUCTIONS.md': { limit: 200, required: false },
  'ai/TASK_TEMPLATE.md': { limit: 180, required: false },
};
let failed = false;
for (const [name, { limit, required }] of Object.entries(limits)) {
  if (!existsSync(name)) {
    console.log(`context/${name}: missing — ${required ? 'FAIL' : 'OPTIONAL'}`);
    failed ||= required;
    continue;
  }
  const actual = readFileSync(name, 'utf8').trimEnd().split(/\r?\n/).length;
  console.log(`context/${name}: ${actual}/${limit} lines — ${actual <= limit ? 'OK' : 'FAIL'}`);
  failed ||= actual > limit;
}
if (failed) {
  console.error('Compact current context and move historical details to docs/development.');
  process.exitCode = 1;
}
