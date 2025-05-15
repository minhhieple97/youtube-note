import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './index.css';

function injectApp() {
  if (!window.location.pathname.includes('/watch')) {
    return;
  }

  const existingApp = document.getElementById('youtube-notes-container');
  if (existingApp) {
    existingApp.remove();
  }

  const container = document.createElement('div');
  container.id = 'youtube-notes-container';

  const findAndInjectIntoDOM = () => {
    const secondaryColumn = document.querySelector('#secondary, #secondary-inner');
    if (secondaryColumn) {
      secondaryColumn.prepend(container);

      addGlobalStyles();

      const root = createRoot(container);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      );
      return true;
    }
    return false;
  };

  if (!findAndInjectIntoDOM()) {
    const retryTimes = [500, 1000, 2000, 3000];
    let attemptCount = 0;

    const retryInjection = () => {
      if (attemptCount < retryTimes.length) {
        setTimeout(() => {
          if (!findAndInjectIntoDOM()) {
            attemptCount++;
            retryInjection();
          }
        }, retryTimes[attemptCount]);
      }
    };

    retryInjection();
  }
}

function addGlobalStyles() {
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
    
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background-color: #f9f9f9;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .app-title {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: #0d0d0d;
    }
    
    .app-actions {
      display: flex;
      gap: 4px;
    }
    
    .action-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: #606060;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .action-btn:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: #0d0d0d;
    }
    
    .add-note-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background-color: #065fd4;
      color: white;
      border: none;
      border-radius: 18px;
      padding: 8px 16px;
      margin: 12px auto;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .add-note-btn:hover {
      background-color: #0356c2;
    }
  `;

  document.head.appendChild(styleElement);
}

// Listen for navigation changes (YouTube uses client-side navigation)
function setupNavigationListener() {
  // YouTube uses History API for navigation
  let lastUrl = window.location.href;

  // Monitor URL changes directly
  const checkForUrlChanges = () => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      // Wait a bit for YouTube to update its DOM
      setTimeout(injectApp, 1000);
    }
    requestAnimationFrame(checkForUrlChanges);
  };
  requestAnimationFrame(checkForUrlChanges);

  // Also watch for DOM changes as a backup method
  const observer = new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
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
