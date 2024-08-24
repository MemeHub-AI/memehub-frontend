import type { Config } from 'tailwindcss'

const baseWidth = {
  main: '1280px',
  aside: '340px',
  18: '4.5rem',
  100: '28rem',
  128: '32rem',
  42: '10.5rem',
  256: '64rem',
  38: '38rem',
}

const baseHeight = {
  header: '64px',
  body: 'calc(100vh - 64px)',
  main: 'calc(100vh - 64px - 64px)',
  footer: '64px',
  18: '4.5rem',
  42: '10.5rem',
  100: '26rem',
}

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        laptop: '1140px',
        '2xl': '1400px',
      },
    },
    extend: {
      width: {
        ...baseWidth,
      },
      minWidth: {
        ...baseWidth,
      },
      maxWidth: {
        ...baseWidth,
      },
      height: {
        ...baseHeight,
      },
      minHeight: {
        ...baseHeight,
      },
      maxHeight: {
        ...baseHeight,
      },
      scrollMargin: {
        ...baseHeight,
      },
      scale: {
        102: '1.02',
      },
      colors: {
        'lime-green': '#CBFF08',
        'lime-green-deep': '#e6fd77',
        'blue-deep': '#2c30ee',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      boxShadow: {
        bold: '0 0 0 4px hsl(var(--border))',
        offset:
          'var(--offset-width, 3px) var(--offset-width, 3px) 0 0 var(--offset-color, black)',
        'offset-border': `var(--offset-width, 3px) var(--offset-width, 3px) 0 0 var(--offset-color, white), 
          var(--offset-width, 3px) var(--offset-width, 3px) 0 2px var(--offset-border-color, black)`,
        input2: '0 0 5px 3px #A4C9EC',
      },
      translate: {
        offset: '4px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        flash: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        horizontalShake: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(15px)' },
          '50%': { transform: 'translateX(-15px)' },
          '75%': { transform: 'translateX(15px)' },
          '100': { transform: 'translateX(0)' },
        },
        leftToRight: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        flash: 'flash 1s ease-out infinite',
        'flash-no-infinite': 'flash 1s ease-out',
        'hori-shake': 'horizontalShake 0.2s 3',
        'left-to-right': 'leftToRight 0.3s',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
