import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../styles/index.css';

// Function to inject our app into YouTube's page
function injectApp() {
  // Check if we're on a YouTube video page
  if (!window.location.pathname.includes('/watch')) {
    return;
  }

  // Remove existing app if there is one
  const existingApp = document.getElementById('youtube-notes-container');
  if (existingApp) {
    existingApp.remove();
  }

  // Create container for our app
  const container = document.createElement('div');
  container.id = 'youtube-notes-container';

  // Find YouTube's secondary column (sidebar)
  const secondaryColumn = document.querySelector('#secondary');

  if (secondaryColumn) {
    // Insert our container at the top of the secondary column
    secondaryColumn.prepend(container);

    // Add global styles for our app
    addGlobalStyles();

    // Render our React app into the container
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
}

// Add global styles for our extension
function addGlobalStyles() {
  // Remove existing styles if any
  const existingStyles = document.getElementById('youtube-notes-global-styles');
  if (existingStyles) {
    existingStyles.remove();
  }

  const styleElement = document.createElement('style');
  styleElement.id = 'youtube-notes-global-styles';
  styleElement.textContent = `
    /* YouTube player button styling */
    .youtube-notes-button-container {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 48px !important;
      height: 48px !important;
      opacity: 0.9 !important;
      transition: opacity 0.1s ease-in-out !important;
    }
    
    .youtube-notes-button-container:hover {
      opacity: 1 !important;
    }
    
    .youtube-notes-icon {
      color: white !important;
      width: 22px !important;
      height: 22px !important;
    }
    
    /* Notes panel styling */
    #youtube-notes-container {
      margin-bottom: 16px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .youtube-notes-app {
      background-color: white;
      border-radius: 12px;
      font-family: Roboto, Arial, sans-serif;
      transition: all 0.3s ease;
    }
    
    .youtube-notes-app.collapsed {
      max-height: 40px;
    }
  `;

  document.head.appendChild(styleElement);
}

// Listen for navigation changes (YouTube uses client-side navigation)
function setupNavigationListener() {
  // YouTube uses History API for navigation
  let lastUrl = window.location.href;

  // Create a new observer for URL changes
  const observer = new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;

      // Re-inject the app with a slight delay to ensure page is loaded
      setTimeout(injectApp, 1000);
    }
  });

  // Start observing
  observer.observe(document.querySelector('body')!, { childList: true, subtree: true });
}

// Initialize our extension
function initialize() {
  injectApp();
  setupNavigationListener();
}

// Run once DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Expose to global for debugging
(window as any).youtubeNotesExtension = {
  injectApp,
};
export {};
