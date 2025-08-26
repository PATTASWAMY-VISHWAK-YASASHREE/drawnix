// Import React's StrictMode component for detecting potential problems in development
// StrictMode helps identify unsafe lifecycles, legacy API usage, and other issues
import { StrictMode } from 'react';

// Import ReactDOM's client-side rendering utilities for React 18+
// This provides the new createRoot API for improved concurrent features
import * as ReactDOM from 'react-dom/client';

// Import the main App component that contains the entire application
// This is the root component that will be rendered into the DOM
import App from './app/app';

// Create the root element for React 18's concurrent rendering
// document.getElementById('root') finds the DOM element with id="root" from index.html
// Type assertion (as HTMLElement) ensures TypeScript knows this is a valid HTML element
// This root will be used to render the entire React application tree
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render the application into the DOM
// StrictMode wrapper enables additional checks and warnings in development mode:
// - Identifies components with unsafe lifecycles
// - Warns about legacy string ref API usage  
// - Warns about deprecated findDOMNode usage
// - Detects unexpected side effects by double-invoking functions
// - Detects legacy context API usage
// The App component is the main entry point for the Drawnix drawing application
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
