/// <reference types='vitest' />
// TypeScript reference directive to include Vitest type definitions
// This enables TypeScript support for Vitest testing framework APIs

// Import Vite's configuration definition function
// Provides type safety and IntelliSense for configuration options
import { defineConfig } from 'vite';

// Import React plugin for Vite to enable React development features
// Handles JSX transformation, React Fast Refresh, and development optimizations
import react from '@vitejs/plugin-react';

// Import Nx plugin for TypeScript path mapping support
// Allows imports using workspace-relative paths defined in tsconfig.json
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// Export Vite configuration for the Drawnix web application
// This configuration optimizes the build and development experience
export default defineConfig({
  // Set the project root to the current directory
  // This tells Vite where to find source files and assets
  root: __dirname,
  
  // Configure Vite's cache directory for faster subsequent builds
  // Shared across the entire monorepo for better cache utilization
  cacheDir: '../../node_modules/.vite/apps/web',

  // Development server configuration
  server: {
    port: 7200, // Custom port for the development server
    host: 'localhost', // Host binding for local development
    // Note: Use port 7200 to avoid conflicts with other services
  },

  // Preview server configuration (for testing production builds locally)
  preview: {
    port: 4300, // Different port for preview mode
    host: 'localhost', // Host binding for preview server
  },

  // Plugin configuration for enhanced development experience
  plugins: [
    react(), // Enable React support with Fast Refresh and JSX
    nxViteTsPaths(), // Enable TypeScript path mapping from tsconfig.json
  ],

  // Worker configuration (currently disabled)
  // Uncomment this if you are using web workers in the application
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  // Production build configuration
  build: {
    // Output directory for built application (relative to workspace root)
    outDir: '../../dist/apps/web',
    
    // Clean output directory before each build to ensure clean state
    emptyOutDir: true,
    
    // Report compressed file sizes after build for optimization insights
    reportCompressedSize: true,
    
    // CommonJS compatibility options for mixed module systems
    // This helps with third-party packages that use CommonJS
    commonjsOptions: {
      // Transform modules that mix ES and CommonJS exports
      // Required for some drawing and canvas-related libraries
      transformMixedEsModules: true,
    },
  },
});
