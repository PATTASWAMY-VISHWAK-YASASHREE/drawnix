/* eslint-disable */
// Disable ESLint for this configuration file as it's a standard setup

// Jest testing configuration for the Drawnix web application
// This configuration extends the workspace-wide Jest preset with React-specific settings
export default {
  // Display name for this project in Jest test output
  // Helps identify which project tests belong to in monorepo setups
  displayName: 'web',
  
  // Base configuration inherited from workspace root
  // Contains shared settings for all projects in the monorepo
  preset: '../../jest.preset.js',
  
  // File transformation rules for different file types during testing
  transform: {
    // Transform non-standard files (images, fonts, etc.) using Nx React plugin
    // This handles imports of static assets in test files
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    
    // Transform TypeScript and JavaScript files using Babel
    // Uses Nx React Babel preset for JSX and modern JS features
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  
  // File extensions that Jest should process and recognize as modules
  // Covers TypeScript, React TSX, and standard JavaScript extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
  // Directory where Jest should output coverage reports
  // Centralized in workspace root for easy access and CI integration
  coverageDirectory: '../../coverage/apps/web',
};
