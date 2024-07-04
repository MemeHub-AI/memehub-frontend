import { create } from 'zustand'

import type { IChartingLibraryWidget } from '../../public/js/charting_library/charting_library'

interface ChartStore {
  chart: IChartingLibraryWidget | null
  chartEl: HTMLDivElement | null

  setChart: (chart: IChartingLibraryWidget | null) => void
  setChartEl: (chartEl: HTMLDivElement) => void
}

export const useChartStore = create<ChartStore>((set, get) => ({
  chart: null,
  chartEl: null,

  setChart: (chart) => set({ chart }),
  setChartEl: (chartEl) => set({ chartEl }),
}))
