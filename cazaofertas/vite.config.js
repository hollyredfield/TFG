import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs'
  },
  // Exclude puppeteer from browser build to prevent class extension errors
  optimizeDeps: {
    exclude: ['puppeteer', 'puppeteer-core', 'playwright', 'playwright-core'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    rollupOptions: {
      external: ['puppeteer', 'puppeteer-core'], // Mark these as external
      output: {
        manualChunks: {
          // Separate vendor chunks
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['react-icons', 'framer-motion'],
        }
      },
      onwarn(warning, warn) {
        // Ignore certain warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || 
            warning.code === 'CIRCULAR_DEPENDENCY' ||
            warning.code === 'UNRESOLVED_IMPORT') {
          return;
        }
        warn(warning);
      }
    },
    // Forzar la compilación ignorando errores
    commonjsOptions: {
      // Process node_modules CommonJS modules more safely
      transformMixedEsModules: true,
      esmExternals: true,
    },
    minify: true,
    sourcemap: false,
    reportCompressedSize: false,
    // Eliminar errores de duplicados de símbolos temporalmente
    esbuildOptions: {
      legalComments: 'none',
      jsx: 'preserve',
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      forceExtractComments: false,
      ignoreAnnotations: true,
    },
  },
  resolve: {
    alias: {
      // Provide empty modules for Node.js modules that might be imported
      // but aren't compatible with browser environments
      fs: resolve(__dirname, 'src/utils/empty-module.js'),
      path: resolve(__dirname, 'src/utils/empty-module.js'),
      net: resolve(__dirname, 'src/utils/empty-module.js'),
      tls: resolve(__dirname, 'src/utils/empty-module.js'),
      child_process: resolve(__dirname, 'src/utils/empty-module.js'),
      http: resolve(__dirname, 'src/utils/empty-module.js'),
      https: resolve(__dirname, 'src/utils/empty-module.js'),
      stream: resolve(__dirname, 'src/utils/empty-module.js'),
      crypto: resolve(__dirname, 'src/utils/empty-module.js'),
      os: resolve(__dirname, 'src/utils/empty-module.js'),
      puppeteer: resolve(__dirname, 'src/utils/empty-module.js'),
      'puppeteer-core': resolve(__dirname, 'src/utils/empty-module.js'),
    }
  },
  define: {
    // Define global values
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'global': 'globalThis',
  }
})
