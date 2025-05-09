import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { StickyNote } from 'lucide-react';

interface PlayerControlButtonProps {
  toggleNotesPanel: () => void;
}

export const PlayerControlButton: React.FC<PlayerControlButtonProps> = ({ toggleNotesPanel }) => {
  const [buttonContainer, setButtonContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Function to inject button into player controls
    const injectButton = () => {
      // Find YouTube's settings button in the player control bar
      const settingsButton = document.querySelector('.ytp-settings-button');
      if (!settingsButton) return;

      // Remove existing button if any
      const existingButton = document.querySelector('.youtube-notes-button-container');
      if (existingButton) {
        existingButton.remove();
      }

      // Create container for our button
      const container = document.createElement('button');
      container.className = 'ytp-button youtube-notes-button-container';
      container.title = 'Add/View Notes (Alt+Y)';
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.cursor = 'pointer';

      // Add click handler
      container.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNotesPanel();
      });

      // Insert after the settings button
      settingsButton.parentNode?.insertBefore(container, settingsButton.nextSibling);

      // Store reference to container
      setButtonContainer(container);
    };

    // Setup a function to check if our button is in the DOM
    const checkAndInject = () => {
      const settingsButton = document.querySelector('.ytp-settings-button');
      const existingButton = document.querySelector('.youtube-notes-button-container');

      // If the settings button exists and our button doesn't, inject it
      if (settingsButton && !existingButton) {
        injectButton();
      }
    };

    // Try injecting the button immediately
    checkAndInject();

    // Also try after a short delay to ensure YouTube UI is loaded
    const initialTimer = setTimeout(checkAndInject, 1000);

    // Set up an observer to detect when the player is added/changed
    const observer = new MutationObserver(() => {
      checkAndInject();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup on unmount
    return () => {
      clearTimeout(initialTimer);
      observer.disconnect();
      if (buttonContainer) {
        buttonContainer.remove();
      }
    };
  }, [toggleNotesPanel]);

  // Render the lucide-react icon through a portal when we have a container
  return buttonContainer
    ? createPortal(
        <StickyNote
          size={20}
          color="white"
          className="youtube-notes-icon"
          style={{ display: 'block' }}
        />,
        buttonContainer,
      )
    : null;
};
