import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset URLs so CSS/JS load on GitHub Pages (/RepoName/) and when opening dist/ locally.
  // Absolute "/assets/..." breaks on project pages → Tailwind never loads (unstyled HTML).
  base: './',
})
