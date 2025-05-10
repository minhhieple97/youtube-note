import React, { useState } from 'react';
import { Note } from '../types';
import { Edit, Trash2, Clock } from 'lucide-react';

interface NotesListProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onJumpToTimestamp: (timestamp: number) => void;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  onEditNote,
  onDeleteNote,
  onJumpToTimestamp,
}) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const sortedNotes = [...notes].sort((a, b) => a.timestamp - b.timestamp);

  const handleDeleteClick = (noteId: string) => {
    if (confirmDelete === noteId) {
      onDeleteNote(noteId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(noteId);
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  if (sortedNotes.length === 0) {
    return (
      <div className="notes-empty-state">
        <p>No notes yet. Add your first note!</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      <h3 className="notes-list-title">Notes ({sortedNotes.length})</h3>
      <ul>
        {sortedNotes.map((note) => (
          <li key={note.id} className="note-item">
            <div
              className="note-timestamp"
              onClick={() => onJumpToTimestamp(note.timestamp)}
              title="Jump to this timestamp"
            >
              <Clock size={14} />
              <span>{note.formattedTime}</span>
            </div>
            <div className="note-content">
              <p className="note-text">{note.text}</p>
            </div>
            <div className="note-actions">
              <button
                className="note-action-btn edit-btn"
                onClick={() => onEditNote(note)}
                title="Edit Note"
              >
                <Edit size={14} />
              </button>
              <button
                className={`note-action-btn delete-btn ${
                  confirmDelete === note.id ? 'confirm' : ''
                }`}
                onClick={() => handleDeleteClick(note.id)}
                title={confirmDelete === note.id ? 'Confirm Delete' : 'Delete Note'}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
