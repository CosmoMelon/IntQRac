import { copyFile, mkdir } from 'node:fs/promises';

// Keep these paths in sync with the static routes declared in src/App.tsx.
const routes = ['generate', 'inspect', 'bank', 'standard', 'security', 'rationale', 'landscape', 'comparison'];
const outputDirectory = new URL('../dist/', import.meta.url);
const source = new URL('index.html', outputDirectory);

for (const route of routes) {
  const destinationDirectory = new URL(`${route}/`, outputDirectory);
  await mkdir(destinationDirectory, { recursive: true });
  await copyFile(source, new URL('index.html', destinationDirectory));
}
