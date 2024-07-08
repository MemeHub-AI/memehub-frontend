import { useState } from 'react';

const useAudioPlayer = () => {
  const [audio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = (src: string) => {
    // Pause any currently playing audio
    if (isPlaying) {
      audio.pause();
    }

    // Set new audio source and play
    audio.src = src;
    audio.play();
    setIsPlaying(true);
  };

  const stopAudio = () => {
    audio.pause();
    setIsPlaying(false);
  };

  return {
    playAudio,
    stopAudio,
    isPlaying,
  };
};

export default useAudioPlayer;
