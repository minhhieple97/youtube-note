# YouTube Notes Chrome Extension

A Chrome extension that enhances YouTube videos with time-stamped note-taking features. Take notes at specific timestamps while watching videos, and easily navigate between them.

## Features

- Add notes at specific timestamps while watching YouTube videos
- View, edit, and delete notes
- Jump to specific timestamps by clicking on saved notes
- Local storage for notes using Chrome's storage API
- Dark mode compatibility
- Keyboard shortcuts for quick note creation
- Export/import notes for backup

## Installation

### Development Mode

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension should now be installed and active

### Building for Production

1. Install dependencies: `npm install`
2. Build the extension: `npm run build`
3. The built extension will be in the `dist` directory
4. Follow steps 2-5 from the Development Mode instructions, but select the `dist` directory

## Usage

1. Navigate to any YouTube video
2. Find the YouTube Notes panel below the video information
3. Click "Add Note" or use Alt+N to create a note at the current timestamp
4. Edit your note and press Ctrl+Enter to save
5. Click on timestamps to jump to that point in the video
6. Use the export/import buttons to backup your notes

## Keyboard Shortcuts

- Alt+N: Create a new note at the current timestamp
- Ctrl+Enter: Save the current note
- Esc: Cancel editing

## Technologies Used

- React
- TypeScript
- Chrome Extension API
- Lucide Icons

## License

[MIT License](LICENSE)