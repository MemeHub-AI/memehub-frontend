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

const options: TVChartOptions = {
  library_path: 'js/charting_library/',
  disabled_features: [
    // Header
    'header_widget',
    // 'header_resolutions',
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

    // 'chart_zoom',
    'left_toolbar',
    'timeframes_toolbar', // bottom time tools.
    'main_series_scale_menu', // bottom right setting button.
    'items_favoriting',
    'show_object_tree',
    // 'create_volume_indicator_by_default',
  ],
  enabled_features: [
    'pre_post_market_sessions',
    // currency logo, need to config in useDatafeed symbolInfo
    // 'show_symbol_logos',
    // 'show_symbol_logo_in_legend',
    'show_spread_operators',
    'move_logo_to_main_pane',
  ],
  // @ts-ignore
  custom_formatters: {
    priceFormatterFactory: (symbolInfo, minTick) => {
      if (symbolInfo?.format === 'price') {
        return {
          format: (price) => fmt.decimals(price, { fixed: 4 }),
        }
      }
      return null
    },
    studyFormatterFactory: (format) => {
      if (format.type === 'volume') {
        return {
          format: (value) => fmt.decimals(value, { fixed: 4 }),
        }
      }
      return null
    },
  },
}

const overrides: Partial<ChartPropertiesOverrides> = {
  'paneProperties.vertGridProperties.color': 'rgba(255,255,255,0)',
  'paneProperties.horzGridProperties.color': 'rgba(255,255,255,0)',
  'mainSeriesProperties.minTick': '1000000000,1,false',
}

export const chartConfig = {
  options,
  overrides,
}
