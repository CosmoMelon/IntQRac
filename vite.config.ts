import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
const isGitHubPages = process.env.VITE_GITHUB_PAGES === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
if (isGitHubPages && !repositoryName) throw new Error('GITHUB_REPOSITORY is required for the GitHub Pages build.');

export default defineConfig({
  base: isGitHubPages ? `/${repositoryName}/` : '/',
  plugins: [react(), tailwindcss()],
  test: { environment: 'node' },
});
