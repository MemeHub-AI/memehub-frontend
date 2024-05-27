import {
  DatafeedConfiguration,
  LibrarySymbolInfo,
  ResolutionString,
} from '../../../../public/charting_library/charting_library'

const readyConfig: DatafeedConfiguration = {
  supported_resolutions: [
    '1',
    '5',
    '15',
    '30',
    '1h',
    '4h',
    '1d',
    '1m',
  ] as ResolutionString[],
  supports_marks: true,
  supports_timescale_marks: true,
}

const symbolInfoConfig: LibrarySymbolInfo = {
  name: 'PEPE',
  type: 'crypto',
  session: '24x7',
  full_name: 'PEPE',
  description: 'PEPE',
  exchange: 'Memehub',
  listed_exchange: 'Memehub',
  format: 'price',
  timezone: 'Etc/UTC',
  supported_resolutions: readyConfig.supported_resolutions!,
  pricescale: 100,
  minmov: 1,
  has_weekly_and_monthly: true,
  has_seconds: true,
  has_ticks: true,
  has_empty_bars: true,
  has_intraday: true,
  visible_plots_set: 'ohlcv',
  volume_precision: 0,
  currency_code: 'PEPE',
}

export const useDatafeedConfig = () => {
  return {
    readyConfig,
    resolutions: readyConfig.supported_resolutions,
    symbolInfoConfig,
  }
}
