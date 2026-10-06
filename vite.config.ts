import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
const isGitHubPages = process.env.VITE_GITHUB_PAGES === 'true';
const [repositoryOwner, repositoryName] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
if (isGitHubPages && (!repositoryOwner || !repositoryName)) throw new Error('GITHUB_REPOSITORY is required for the GitHub Pages build.');
const isOrganizationSite = repositoryName?.toLowerCase() === `${repositoryOwner?.toLowerCase()}.github.io`;

export default defineConfig({
  base: isGitHubPages && !isOrganizationSite ? `/${repositoryName}/` : '/',
  plugins: [react(), tailwindcss()],
  test: { environment: 'node' },
});
