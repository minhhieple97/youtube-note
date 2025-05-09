import React, { useState, useEffect } from 'react';
import { Pencil, PlayCircle, PauseCircle } from 'lucide-react';
import { formatTimestamp } from '../utils/timeUtils';

interface VideoControlsProps {
  currentTime: number;
  onAddNote: () => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({ currentTime, onAddNote }) => {
  const [formattedTime, setFormattedTime] = useState(formatTimestamp(currentTime));
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    setFormattedTime(formatTimestamp(currentTime));
    
    // Check if video is playing
    const videoElement = document.querySelector<HTMLVideoElement>('video');
    if (videoElement) {
      setIsPlaying(!videoElement.paused);
      
      // Listen for play/pause events
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      
      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
      };
    }
  }, [currentTime]);
  
  const togglePlayPause = () => {
    const videoElement = document.querySelector<HTMLVideoElement>('video');
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  };
  
  return (
    <div className="video-controls">
      <div className="timestamp-display">
        <span className="current-timestamp">{formattedTime}</span>
      </div>
      <div className="controls-actions">
        <button 
          className="control-btn play-pause-btn" 
          onClick={togglePlayPause}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
        </button>
        <button 
          className="control-btn add-note-btn" 
          onClick={onAddNote}
          title="Add Note at Current Time"
        >
          <Pencil size={18} /> Note
        </button>
      </div>
    </div>
  );
};