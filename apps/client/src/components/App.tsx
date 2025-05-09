import React, { useEffect, useState } from 'react';
import { VideoControls } from './VideoControls';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';
import { PlayerControlButton } from './PlayerControlButton';
import { Note } from '../types';
import { useVideoInfo } from '../hooks/useVideoInfo';
import { useNotes } from '../hooks/useNotes';
import { formatTimestamp } from '../utils/timeUtils';
import { Plus, ArrowUp, ArrowDown, Download, Upload } from 'lucide-react';

const App: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showPlayerButton, setShowPlayerButton] = useState(false);
  const { videoId, videoTitle, getCurrentTime, seekToTime } = useVideoInfo();
  const { notes, addNote, updateNote, deleteNote, exportNotes, importNotes } = useNotes(videoId);

  // Check if we're on a YouTube watch page
  useEffect(() => {
    const isWatchPage = window.location.pathname.includes('/watch');
    setShowPlayerButton(isWatchPage);
  }, []);

  // Keyboard shortcut setup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+N to create a new note
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        handleAddNote();
      }

      // Alt+Y to toggle notes panel
      if (e.altKey && e.key === 'y') {
        e.preventDefault();
        toggleVisibility();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [videoId]);

  const handleAddNote = () => {
    const currentTime = getCurrentTime();
    setEditingNote({
      id: Date.now().toString(),
      videoId,
      timestamp: currentTime,
      text: '',
      formattedTime: formatTimestamp(currentTime),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(true);
    setIsVisible(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditing(true);
  };

  const handleSaveNote = (note: Note) => {
    if (notes.some((n) => n.id === note.id)) {
      updateNote(note);
    } else {
      addNote(note);
    }
    setIsEditing(false);
    setEditingNote(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingNote(null);
  };

  const handleJumpToTimestamp = (timestamp: number) => {
    seekToTime(timestamp);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!videoId) {
    return null;
  }

  return (
    <>
      {showPlayerButton && <PlayerControlButton toggleNotesPanel={toggleVisibility} />}

      {isVisible && videoId && (
        <div className={`youtube-notes-app ${isCollapsed ? 'collapsed' : ''}`}>
          <div className="app-header">
            <h2 className="app-title">YouTube Notes</h2>
            <div className="app-actions">
              <button
                className="action-btn export-btn"
                title="Export Notes"
                onClick={() => exportNotes()}
              >
                <Download size={16} />
              </button>
              <button
                className="action-btn import-btn"
                title="Import Notes"
                onClick={() => importNotes()}
              >
                <Upload size={16} />
              </button>
              <button
                className="action-btn collapse-btn"
                title={isCollapsed ? 'Expand' : 'Collapse'}
                onClick={toggleCollapse}
              >
                {isCollapsed ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
              </button>
            </div>
          </div>

          {!isCollapsed && (
            <div className="app-content">
              {isEditing ? (
                <NoteEditor
                  note={editingNote!}
                  onSave={handleSaveNote}
                  onCancel={handleCancelEdit}
                  getCurrentTime={getCurrentTime}
                />
              ) : (
                <>
                  <VideoControls currentTime={getCurrentTime()} onAddNote={handleAddNote} />
                  <NotesList
                    notes={notes}
                    onEditNote={handleEditNote}
                    onDeleteNote={deleteNote}
                    onJumpToTimestamp={handleJumpToTimestamp}
                  />
                  <button className="add-note-btn" onClick={handleAddNote} title="Add Note (Alt+N)">
                    <Plus size={16} /> Add Note
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default App;
