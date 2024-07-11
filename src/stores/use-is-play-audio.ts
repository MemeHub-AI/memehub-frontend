import { create } from 'zustand'

interface isPlayAudioStore {
  isPlayHomeAudio: boolean,
  isPlayAirdropAudio: boolean,
  isPlayAllianceAudio: boolean

  setIsPlayHomeAudio: (isPlayHomeAudio: boolean) => void
  setIsPlayAirdropAudio: (isPlayAirdropAudio: boolean) => void
  setIsPlayAllianceAudio: (isPlayAllianceAudio: boolean) => void
}

export const useIsPlayAudio = create<isPlayAudioStore>((set) => ({
  isPlayHomeAudio: true,
  isPlayAirdropAudio: true,
  isPlayAllianceAudio: true,

  setIsPlayHomeAudio: (isPlayHomeAudio) => set({ isPlayHomeAudio }),
  setIsPlayAirdropAudio: (isPlayAirdropAudio) => set({ isPlayAirdropAudio }),
  setIsPlayAllianceAudio: (isPlayAllianceAudio) => set({ isPlayAllianceAudio }),
}))
