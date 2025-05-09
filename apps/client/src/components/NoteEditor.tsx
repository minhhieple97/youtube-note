import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { formatTimestamp } from '../utils/timeUtils';
import { Save, X, Clock, RefreshCw } from 'lucide-react';

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  onCancel: () => void;
  getCurrentTime: () => number;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ 
  note, 
  onSave, 
  onCancel,
  getCurrentTime
}) => {
  const [text, setText] = useState(note.text);
  const [timestamp, setTimestamp] = useState(note.timestamp);
  const [formattedTime, setFormattedTime] = useState(note.formattedTime);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Set focus on the textarea when the editor opens
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleUpdateTimestamp = () => {
    const currentTime = getCurrentTime();
    setTimestamp(currentTime);
    setFormattedTime(formatTimestamp(currentTime));
  };

  const handleSave = () => {
    if (!text.trim()) return;
    
    const updatedNote: Note = {
      ...note,
      text,
      timestamp,
      formattedTime,
      updatedAt: new Date().toISOString()
    };
    
    onSave(updatedNote);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter or Command+Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    
    // Escape to cancel
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="note-editor">
      <div className="editor-header">
        <div className="timestamp-control">
          <button 
            className="timestamp-btn" 
            onClick={handleUpdateTimestamp}
            title="Update timestamp to current time"
          >
            <Clock size={14} />
            <span>{formattedTime}</span>
            <RefreshCw size={12} />
          </button>
        </div>
        <div className="editor-actions">
          <button 
            className="editor-action-btn save-btn" 
            onClick={handleSave}
            title="Save Note (Ctrl+Enter)"
            disabled={!text.trim()}
          >
            <Save size={16} />
          </button>
          <button 
            className="editor-action-btn cancel-btn" 
            onClick={onCancel}
            title="Cancel (Esc)"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        className="note-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your note here..."
        rows={5}
      />
      <div className="editor-formatting">
        <button className="format-btn bold-btn" title="Bold (Ctrl+B)">B</button>
        <button className="format-btn italic-btn" title="Italic (Ctrl+I)">I</button>
        <button className="format-btn underline-btn" title="Underline (Ctrl+U)">U</button>
        <button className="format-btn list-btn" title="Bullet List">•</button>
      </div>
      <div className="editor-footer">
        <span className="shortcut-hint">Ctrl+Enter to save, Esc to cancel</span>
      </div>
    </div>
  );
};