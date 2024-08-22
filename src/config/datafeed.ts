import { t } from 'i18next'
import {
  DatafeedConfiguration,
  LibrarySymbolInfo,
  ResolutionString,
} from '../../public/js/charting_library/charting_library'
import { DatafeedCandles } from '@/components/chart/hooks/use-datafeed/types'
import { ObjectLike } from '@/utils/types'

export const datafeedResolutionsMap = {
  '1s': `1${t('s')}`,
  '1': `1${t('m')}`,
  '5': `5${t('m')}`,
  '15': `15${t('m')}`,
  '30': `30${t('m')}`,
  '60': `1${t('h')}`,
  '240': `4${t('h')}`,
  '1d': `1${t('d')}`,
  '1w': `1${t('w')}`,
  '1m': `1${t('M')}`,
} as ObjectLike<string>

export const datafeedResolutions = [
  '1s',
  '1',
  '5',
  '15',
  '30',
  '60',
  '240',
  '1d',
  '1w',
  '1m',
] as ResolutionString[]

export const datafeedDefaultInterval = '1m'

export const datafeedConfig: DatafeedConfiguration = {
  supported_resolutions: [...datafeedResolutions],
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
