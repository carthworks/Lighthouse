/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* light gray */
        input: "var(--color-input)", /* white */
        ring: "var(--color-ring)", /* bright blue */
        background: "var(--color-background)", /* warm off-white */
        foreground: "var(--color-foreground)", /* near-black */
        primary: {
          DEFAULT: "var(--color-primary)", /* deep blue */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* sophisticated slate */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* clear red */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* light slate */
          foreground: "var(--color-muted-foreground)", /* medium gray */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* bright blue */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* white */
          foreground: "var(--color-popover-foreground)", /* near-black */
        },
        card: {
          DEFAULT: "var(--color-card)", /* pure white */
          foreground: "var(--color-card-foreground)", /* near-black */
        },
        success: {
          DEFAULT: "var(--color-success)", /* professional green */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber */
          foreground: "var(--color-warning-foreground)", /* white */
        },
        error: {
          DEFAULT: "var(--color-error)", /* clear red */
          foreground: "var(--color-error-foreground)", /* white */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'tooltip': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'slide-down': 'slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'progress': 'progress 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { height: '0', opacity: '0' },
          '100%': { height: 'auto', opacity: '1' },
        },
        slideUp: {
          '0%': { height: 'auto', opacity: '1' },
          '100%': { height: '0', opacity: '0' },
        },
        progress: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '1000': '1000',
        '1005': '1005',
        '1010': '1010',
        '1020': '1020',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}