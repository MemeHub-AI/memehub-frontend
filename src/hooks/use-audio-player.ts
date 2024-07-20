import { useState } from 'react'

let audio: HTMLAudioElement

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  if (audio == null) audio = new Audio()

  const playAudio = (src: string) => {
    if (isPlaying) stopAudio()

    // Set new audio source and play
    audio.src = src
    audio.play()
    setIsPlaying(true)
  }

  const stopAudio = () => {
    audio.pause()
    setIsPlaying(false)
  }

  const playError = () => playAudio('/audio/e.mp3')

  const playSuccess = () => playAudio('/audio/success.mp3')

  const playGuaGua = () => playAudio('/audio/guagua.mp3')

  return {
    isPlaying,
    playAudio,
    stopAudio,
    playError,
    playSuccess,
    playGuaGua,
  }
}

export default useAudioPlayer
