import {
  ChartPropertiesOverrides,
  ChartingLibraryWidgetOptions,
  TradingTerminalWidgetOptions,
} from '../../public/js/charting_library/charting_library'
import { fmt } from '@/utils/fmt'

type TVChartOptions = Omit<
  ChartingLibraryWidgetOptions | TradingTerminalWidgetOptions,
  'container' | 'datafeed' | 'interval' | 'localets' | 'locale'
>

const format = (price?: number) => fmt.decimals(price, { fixed: 6 })

export const chartOptions: TVChartOptions = {
  library_path: 'js/charting_library/',
  disabled_features: [
    'header_widget',
    'header_symbol_search',
    'header_compare',
    'header_chart_type',
    'header_indicators',
    'header_undo_redo',
    'header_settings',
    'header_screenshot',
    'header_fullscreen_button',
    'display_market_status',

    'context_menus',
    'show_interval_dialog_on_key_press',
    'property_pages',
    'symbol_search_hot_key',

    'left_toolbar',
    'timeframes_toolbar',
    'main_series_scale_menu',
    'items_favoriting',
    'show_object_tree',
  ],
  enabled_features: [
    'pre_post_market_sessions',
    'show_spread_operators',
    'move_logo_to_main_pane',
  ],
  // @ts-ignore
  custom_formatters: {
    priceFormatterFactory: (symbolInfo, minTick) => {
      if (symbolInfo?.format === 'price') {
        return { format }
      }
      return null
    },
    studyFormatterFactory: ({ type }) => {
      if (type === 'volume') {
        return { format }
      }
      return null
    },
  },
}

export const chartOverrides: Partial<ChartPropertiesOverrides> = {
  'paneProperties.vertGridProperties.color': 'rgba(255,255,255,0)',
  'paneProperties.horzGridProperties.color': 'rgba(255,255,255,0)',
}
