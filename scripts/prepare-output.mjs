// OneDrive no Windows pode marcar diretórios de saída como somente leitura.
// Ajusta apenas os diretórios de build deste projeto; não remove arquivos.
import { chmodSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
const target = process.argv[2] || '.next';
if (
  !['.next', '.next-dev', 'artifacts/browser-results', 'artifacts/dev-browser-results'].includes(
    target,
  )
)
  throw new Error('Pasta de saída não permitida.');
const root = resolve(target);
if (existsSync(root) && process.platform === 'win32') {
  const makeWritable = (path) => {
    chmodSync(path, 0o777);
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (entry.isDirectory()) makeWritable(join(path, entry.name));
    }
  };
  makeWritable(root);
}
