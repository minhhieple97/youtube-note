import { useState, useEffect } from 'react';
import { Note, NotesStorage } from '../types';

// Helper to check if Chrome storage API is available
const isChromeStorageAvailable = () => {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
};

export const useNotes = (videoId: string) => {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from storage when videoId changes
  useEffect(() => {
    if (!videoId) return;

    const loadNotes = async () => {
      try {
        if (isChromeStorageAvailable()) {
          // Chrome extension environment
          const result = await chrome.storage.local.get(['youtubeNotes']);
          const allNotes: NotesStorage = result.youtubeNotes || {};
          const videoNotes = allNotes[videoId] || [];
          setNotes(videoNotes);
        } else {
          // Development/browser environment
          const storedData = localStorage.getItem('youtubeNotes');
          const allNotes: NotesStorage = storedData ? JSON.parse(storedData) : {};
          const videoNotes = allNotes[videoId] || [];
          setNotes(videoNotes);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        setNotes([]);
      }
    };

    loadNotes();
  }, [videoId]);

  // Save notes to storage whenever they change
  const saveNotes = async (updatedNotes: Note[]) => {
    if (!videoId) return;

    try {
      if (isChromeStorageAvailable()) {
        // Chrome extension environment
        const result = await chrome.storage.local.get(['youtubeNotes']);
        const allNotes: NotesStorage = result.youtubeNotes || {};

        // Update notes for this video
        allNotes[videoId] = updatedNotes;

        // Save back to storage
        await chrome.storage.local.set({ youtubeNotes: allNotes });
      } else {
        // Development/browser environment
        const storedData = localStorage.getItem('youtubeNotes');
        const allNotes: NotesStorage = storedData ? JSON.parse(storedData) : {};

        // Update notes for this video
        allNotes[videoId] = updatedNotes;

        // Save back to localStorage
        localStorage.setItem('youtubeNotes', JSON.stringify(allNotes));
      }

      // Update local state
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  // Add a new note
  const addNote = (note: Note) => {
    const updatedNotes = [...notes, note];
    saveNotes(updatedNotes);
  };

  // Update an existing note
  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) => (note.id === updatedNote.id ? updatedNote : note));
    saveNotes(updatedNotes);
  };

  // Delete a note
  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    saveNotes(updatedNotes);
  };

  // Export notes for this video
  const exportNotes = () => {
    if (notes.length === 0) {
      alert('No notes to export for this video.');
      return;
    }

    const dataStr = JSON.stringify(notes, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `youtube-notes-${videoId}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import notes for this video
  const importNotes = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const importedNotes = JSON.parse(event.target?.result as string) as Note[];

          // Validate imported notes
          if (!Array.isArray(importedNotes)) {
            throw new Error('Invalid format: Notes should be an array');
          }

          // Filter notes and ensure they match this video's ID
          const validNotes = importedNotes.filter((note) => {
            // Add missing videoId if not present
            if (!note.videoId) {
              note.videoId = videoId;
            }
            return true;
          });

          // Combine with existing notes, removing duplicates by ID
          const existingIds = new Set(notes.map((note) => note.id));
          const newNotes = validNotes.filter((note) => !existingIds.has(note.id));
          const combinedNotes = [...notes, ...newNotes];

          saveNotes(combinedNotes);
          alert(`Successfully imported ${newNotes.length} new notes.`);
        } catch (error) {
          console.error('Error importing notes:', error);
          alert('Failed to import notes. Invalid file format.');
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    exportNotes,
    importNotes,
  };
};
