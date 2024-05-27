import { create } from 'zustand'

import type { IChartingLibraryWidget } from '../../public/charting_library/charting_library'

interface CandlestickStore {
  chart: IChartingLibraryWidget | null
  chartEl: HTMLDivElement | null

  setChart: (chart: IChartingLibraryWidget) => void
  setChartEl: (chartEl: HTMLDivElement) => void
}

export const useCandlestickStore = create<CandlestickStore>((set, get) => ({
  chart: null,
  chartEl: null,

  setChart: (chart) => set({ chart }),
  setChartEl: (chartEl) => set({ chartEl }),
}))
