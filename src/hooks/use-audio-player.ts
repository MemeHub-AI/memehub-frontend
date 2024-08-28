import { useState } from 'react'

let audio: HTMLAudioElement

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  if (audio == null) audio = new Audio()

  const playAudio = (src: string, volume?: number) => {
    if (isPlaying) stopAudio()

    // Set new audio source and play
    audio.src = src
    audio.play()
    if (volume) audio.volume = volume
    setIsPlaying(true)
  }

  const stopAudio = () => {
    audio.pause()
    setIsPlaying(false)
  }

  const playError = () => playAudio('/audio/e.mp3')

  const playSuccess = () => playAudio('/audio/success.mp3')

  const playGuaGua = () => playAudio('/audio/guagua.mp3')

  const playGua = () => playAudio('/audio/gua.mp3')

  const playFire = () => playAudio('/audio/fire.mp3')

  const playHome = () => playAudio('/audio/home.mp3', 0.3)

  const playRap = () => playAudio('/audio/rap-dos-memes.mp3', 0.3)

  const playAlliance = () => playAudio('/audio/alliance.mp3', 0.3)

  return {
    isPlaying,
    playAudio,
    stopAudio,
    playError,
    playSuccess,
    playGuaGua,
    playGua,
    playFire,
    playHome,
    playRap,
    playAlliance,
  }
}

export default useAudioPlayer
