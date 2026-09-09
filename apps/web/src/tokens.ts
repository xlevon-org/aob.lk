export const DERIV_TOKENS = {
  colors: {
    primary: '#ff444f', // Deriv signature Coral Red
    primaryHover: '#eb3e48',
    primaryActive: '#d4353e',
    primaryLight: '#fff1f2',
    primarySubtle: '#ffeaeb',
    
    // Backgrounds & Surfaces
    bgPure: '#ffffff',
    bgLight: '#f8f9fa',
    bgNeutral: '#f2f3f5',
    bgDark: '#0e0e0e',
    bgDarkSecondary: '#15171c',
    bgDarkCard: '#1d2027',
    
    // Borders
    borderLight: '#e6e9ea',
    borderMedium: '#d6dadb',
    borderDark: '#2a2e39',
    
    // Typography
    textPrimary: '#111111',
    textSecondary: '#333333',
    textMuted: '#6e6e6e',
    textPlaceholder: '#999999',
    textInverse: '#ffffff',
    
    // Accents & Badges
    greenAccent: '#008832',
    greenLight: '#e8f7ee',
    blueAccent: '#2196f3',
    blueLight: '#e3f2fd',
    amberAccent: '#f59e0b',
    amberLight: '#fef3c7',
    purpleAccent: '#8b5cf6',
    purpleLight: '#f3e8ff',
  },
  typography: {
    fontSans: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontHeading: "'Ubuntu', 'IBM Plex Sans', sans-serif",
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.65',
      loose: '1.8',
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },
  radii: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    pill: '9999px',
  },
  shadows: {
    card: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
    cardHover: '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
    dropdown: '0 10px 30px rgba(0, 0, 0, 0.12)',
    modal: '0 20px 50px rgba(0, 0, 0, 0.25)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
  },
  container: {
    maxWidth: '1240px',
    paddingMobile: '16px',
    paddingDesktop: '24px',
  }
} as const;
