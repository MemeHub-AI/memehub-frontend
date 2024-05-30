import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
  TradingTerminalWidgetOptions,
} from '../../../../public/charting_library/charting_library'

type TVChartOptions = Omit<
  ChartingLibraryWidgetOptions | TradingTerminalWidgetOptions,
  'container' | 'datafeed' | 'interval' | 'localets' | 'locale'
>

const chartConfig: TVChartOptions = {
  library_path: '/charting_library/',
  disabled_features: [
    // Header
    // 'header_widget',
    // 'header_resolutions',
    'header_symbol_search',
    'header_compare',
    'header_chart_type',
    'header_indicators',
    'header_undo_redo',
    'header_settings',
    'header_screenshot',
    'header_fullscreen_button',
    // Legend
    // 'legend_widget',
    // 'edit_buttons_in_legend',
    'display_market_status',
    // Menu
    'context_menus',
    'show_interval_dialog_on_key_press',
    'property_pages',
    'symbol_search_hot_key',
    // Functionality
    // 'chart_zoom',
    'left_toolbar',
    'timeframes_toolbar', // bottom time tools.
    'main_series_scale_menu', // bottom right setting button.
    'items_favoriting',
    'show_object_tree',
    'create_volume_indicator_by_default',
  ],
  enabled_features: [
    'pre_post_market_sessions',
    // currency logo, need to config in useDatafeed symbolInfo
    // 'show_symbol_logos',
    // 'show_symbol_logo_in_legend',
    'show_spread_operators',
    'move_logo_to_main_pane',
  ],
  // Bottom times.
  time_frames: [
    {
      text: '1m',
      resolution: '1D' as ResolutionString,
      title: '1M',
    },
    {
      text: '6m',
      resolution: '1W' as ResolutionString,
      title: '6M',
    },
    {
      text: '1y',
      resolution: '1W' as ResolutionString,
      title: '1Y',
    },
    {
      text: '3y',
      resolution: '1M' as ResolutionString,
      title: '3Y',
    },
    {
      text: '1000y',
      resolution: '1W' as ResolutionString,
      title: 'All',
    },
  ],
  time_scale: {
    min_bar_spacing: 0,
  },
  // Disable some drawing tools.
  drawings_access: {
    type: 'black',
    tools: [
      // {
      //   name: 'Trend Line', // Must be use displayed lang.
      //   grayed: true,
      // },
    ],
  },
  // overrides: {},
  // studies_overrides: {},
  // If volume doesn't exist, then should be enabled this blacklist,
  // because these indicators need to depend on the volume.
  studies_access: {
    type: 'black',
    tools: [
      { name: 'Accumulation/Distribution' },
      { name: 'Ease of Movement' },
      { name: 'Elders Force Index' },
      { name: 'Klinger Oscillator' },
      { name: 'Money Flow Index' },
      { name: 'Net Volume' },
      { name: 'On Balance Volume' },
      { name: 'Price Volume Trend' },
      { name: 'VWAP' },
      { name: 'Volume Oscillator' },
    ],
  },
}

export const useCandlestickConfig = () => {
  return {
    chartConfig,
  }
}
