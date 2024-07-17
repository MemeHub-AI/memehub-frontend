import { create } from 'zustand'

interface AirdropStore {
  isClaimingAirdrop: boolean

  setIsCalimingAirdrop: (b: boolean) => void
}

export const useAirdropStore = create<AirdropStore>((set, get) => ({
  isClaimingAirdrop: false,

  setIsCalimingAirdrop: (isClaimingAirdrop) => set({ isClaimingAirdrop }),
}))
