// Import React hooks for state management and side effects
// useState: manages local component state for board data
// useEffect: handles data loading and initialization on component mount
import { useState, useEffect } from 'react';

// Import function to initialize default board data structure
// This provides the initial drawing elements when no saved data exists
import { initializeData } from './initialize-data';

// Import the main Drawnix drawing component and utility functions from the core library
// Drawnix: Primary drawing canvas and toolbar interface
// replaceDefaultChineseTexts: Utility function for internationalization text replacement
import { Drawnix, replaceDefaultChineseTexts } from '@drawnix/drawnix';

// Import Plait framework types and components for drawing board functionality
// PlaitBoard: Core board interface for drawing operations
// PlaitElement: Type definition for drawable elements (shapes, text, etc.)
// PlaitTheme: Theme configuration for visual styling
// Viewport: Camera/view position and zoom state
import { PlaitBoard, PlaitElement, PlaitTheme, Viewport } from '@plait/core';

// Import localforage for improved local storage with IndexedDB fallback
// Provides better performance and larger storage capacity than localStorage
import localforage from 'localforage';

// Legacy storage key for backward compatibility (will be removed after 1 month)
// Used to migrate old localStorage data to new localforage system
// Chinese comment: 1个月后移出删除兼容 (Remove compatibility after 1 month)
const OLD_DRAWNIX_LOCAL_DATA_KEY = 'drawnix-local-data';

// Current storage key for main board content in localforage
// This stores the complete board state including elements, viewport, and theme
const MAIN_BOARD_CONTENT_KEY = 'main_board_content';

// Configure localforage for optimal storage performance
// name: Database name for IndexedDB
// storeName: Object store name within the database
// driver: Priority list of storage drivers (IndexedDB preferred, localStorage fallback)
localforage.config({
  name: 'Drawnix',
  storeName: 'drawnix_store',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});

// Main App component - root component for the Drawnix drawing application
// Manages board state, data persistence, and provides the drawing interface
export function App() {
  // State to hold the complete board data structure
  // children: Array of drawable elements (shapes, text, arrows, etc.)
  // viewport: Camera position, zoom level, and view boundaries
  // theme: Visual styling configuration (colors, fonts, etc.)
  const [value, setValue] = useState<{
    children: PlaitElement[];
    viewport?: Viewport;
    theme?: PlaitTheme;
  }>({ children: [] });

  // Effect hook to load persisted board data on component mount
  // Handles data migration from old localStorage to new localforage system
  useEffect(() => {
    // Async function to handle data loading with multiple fallback strategies
    const loadData = async () => {
      // First: Try to load from current localforage storage
      // This is the preferred storage method with better performance
      const storedData = await localforage.getItem(MAIN_BOARD_CONTENT_KEY);
      if (storedData) {
        // Data found in localforage - use it directly
        setValue(storedData as any);
        return;
      }
      
      // Second: Check for legacy localStorage data to migrate
      // This ensures users don't lose their work when upgrading
      const localData = localStorage.getItem(OLD_DRAWNIX_LOCAL_DATA_KEY);
      if (localData) {
        // Parse legacy data and migrate to new storage system
        const parsedData = JSON.parse(localData);
        setValue(parsedData);
        // Save to new storage system for future use
        await localforage.setItem(MAIN_BOARD_CONTENT_KEY, parsedData);
        // Remove legacy data to complete migration
        localStorage.removeItem(OLD_DRAWNIX_LOCAL_DATA_KEY);
        return;
      }
      
      // Third: No existing data found - initialize with default content
      // Deep clone to prevent mutation of the original template
      const initial = JSON.parse(JSON.stringify(initializeData));
      // Replace any Chinese text with English for internationalization
      replaceDefaultChineseTexts(initial);
      // Set initial state with default drawing elements
      setValue({ children: initial });
    };

    // Execute data loading when component mounts
    loadData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Render the complete application UI
  return (
    // Drawnix component includes its own I18nProvider internally
    // So we don't need to wrap it here - it provides internationalization throughout the app
    <Drawnix
      // Pass current board elements to the drawing component
      value={value.children}
      // Pass current viewport state (camera position, zoom level)
      viewport={value.viewport}
      // Pass current theme configuration for visual styling
      theme={value.theme}
      // Handle changes to board content and persist to storage
      // This callback is triggered whenever elements are added, modified, or deleted
      onChange={(value) => {
        // Save updated board data to localforage for persistence
        // This ensures user work is automatically saved as they draw
        localforage.setItem(MAIN_BOARD_CONTENT_KEY, value);
      }}
      // Callback executed after the drawing board is fully initialized
      // Used to set up debugging tools and global console access
      afterInit={(board) => {
        // Log successful board initialization for debugging
        console.log('board initialized');
        // Inform developers about the global debug function
        console.log(
          `add __drawnix__web__debug_log to window, so you can call add log anywhere, like: window.__drawnix__web__console('some thing')`
        );
        // Attach debug logging function to window object for global access
        // This allows developers to log debug information from anywhere in the app
        (window as any)['__drawnix__web__console'] = (value: string) => {
          addDebugLog(board, value);
        };
      }}
    ></Drawnix>
  );
}

// Debug logging utility function for development and troubleshooting
// Creates a visual console overlay within the Drawnix component
// board: The PlaitBoard instance that contains the drawing canvas
// value: The debug message string to display in the console
const addDebugLog = (board: PlaitBoard, value: string) => {
  // Find the main Drawnix container element in the DOM
  // This is where we'll append our debug console overlay
  const container = PlaitBoard.getBoardContainer(board).closest(
    '.drawnix'
  ) as HTMLElement;
  
  // Look for existing console container to avoid creating duplicates
  let consoleContainer = container.querySelector('.drawnix-console');
  if (!consoleContainer) {
    // Create new console container if it doesn't exist
    // This will hold all debug log messages
    consoleContainer = document.createElement('div');
    consoleContainer.classList.add('drawnix-console');
    // Append to the main container so it's visible over the drawing area
    container.append(consoleContainer);
  }
  
  // Create individual message element for this log entry
  const div = document.createElement('div');
  // Set the debug message content (supports HTML formatting)
  div.innerHTML = value;
  // Add the message to the console container
  consoleContainer.append(div);
};

// Export as default for clean imports in other modules
// This allows importing as: import App from './app/app'
export default App;
