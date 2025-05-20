import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'SupanoticeWebComponents',
      fileName: (format) => `supanotice-components.${format}.js`,
      formats: ['es']
    },
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: [], // You could add 'lit' here if you want users to provide it, but usually for web components we bundle everything
      output: {
        // Global variable names for externalized dependencies in UMD build
        globals: {},
      }
    },
    // Generate .d.ts type declarations
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'terser',
  }
});
