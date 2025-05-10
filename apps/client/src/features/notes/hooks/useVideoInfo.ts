import { useState, useEffect } from 'react';

export const useVideoInfo = () => {
  const [videoId, setVideoId] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');

  useEffect(() => {
    // Extract video ID from URL
    const extractVideoId = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('v') || '';
    };

    // Extract video title from page
    const extractVideoTitle = () => {
      const titleElement = document.querySelector(
        'h1.title.style-scope.ytd-video-primary-info-renderer',
      );
      return titleElement ? titleElement.textContent || '' : '';
    };

    const updateVideoInfo = () => {
      const newVideoId = extractVideoId();
      const newVideoTitle = extractVideoTitle();

      setVideoId(newVideoId);
      setVideoTitle(newVideoTitle);
    };

    // Set initial values
    updateVideoInfo();

    // Set up observer for title changes (YouTube loads the title dynamically)
    const observer = new MutationObserver(updateVideoInfo);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  // Function to get current video time
  const getCurrentTime = (): number => {
    const videoElement = document.querySelector<HTMLVideoElement>('video');
    return videoElement ? Math.floor(videoElement.currentTime) : 0;
  };

  // Function to seek to a specific time
  const seekToTime = (time: number): void => {
    const videoElement = document.querySelector<HTMLVideoElement>('video');
    if (videoElement) {
      videoElement.currentTime = time;
    }
  };

  return {
    videoId,
    videoTitle,
    getCurrentTime,
    seekToTime,
  };
};
