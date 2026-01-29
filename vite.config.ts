import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs-extra";

// Plugin to copy pre-built docs to dist folder
// This ensures docs are available in deployment even though Quarto isn't installed in the build container
const copyDocsPlugin = () => ({
  name: 'copy-docs',
  closeBundle: async () => {
    const docsSource = path.resolve(__dirname, 'public/docs');
    const docsTarget = path.resolve(__dirname, 'dist/docs');
    
    if (fs.existsSync(docsSource)) {
      await fs.copy(docsSource, docsTarget);
      console.log('✓ Copied pre-built docs to dist/docs/');
    } else {
      console.warn('⚠ Warning: public/docs/ not found - docs will not be available');
    }
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
  
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    copyDocsPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
