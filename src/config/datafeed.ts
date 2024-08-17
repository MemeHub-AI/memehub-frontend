import {
  DatafeedConfiguration,
  LibrarySymbolInfo,
  ResolutionString,
} from '../../public/js/charting_library/charting_library'
import { DatafeedCandles } from '@/components/chart/hooks/use-datafeed/types'

export const datafeedConfig: DatafeedConfiguration = {
  supported_resolutions: [
    '1',
    '5',
    '15',
    '30',
    '1h',
    '4h',
    '1d',
  ] as ResolutionString[],
  supports_marks: true,
  supports_timescale_marks: true,
}

export const symbolInfoConfig: LibrarySymbolInfo = {
  pricescale: 100,
  minmov: 1,
  visible_plots_set: 'ohlcv',

  name: 'Memehub',
  type: 'crypto',
  session: '24x7',
  full_name: 'Memehub',
  description: 'Memehub',
  exchange: 'Memehub',
  listed_exchange: 'Memehub',
  format: 'price',
  timezone: 'Etc/UTC',
  supported_resolutions: datafeedConfig.supported_resolutions!,
  has_weekly_and_monthly: true,
  has_seconds: true,
  has_ticks: true,
  has_intraday: true,
  volume_precision: 18,
  currency_code: 'Memehub',
}

export const datafeedUnit: keyof DatafeedCandles = 'master'
