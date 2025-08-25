import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Gaming theme colors
        'game-dark': 'hsl(228, 15%, 11%)',
        'game-card': 'hsl(220, 13%, 18%)',
        'game-muted': 'hsl(216, 10%, 31%)',
        'game-text': 'hsl(210, 6%, 76%)',
        'game-orange': 'hsl(14, 100%, 60%)',
        'game-yellow': 'hsl(39, 92%, 56%)',
        
        // Base design system
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        card: ["var(--font-card)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        game: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "elixir-glow": {
          "0%": {
            filter: "drop-shadow(0 0 5px rgba(147, 51, 234, 0.5))",
          },
          "100%": {
            filter: "drop-shadow(0 0 15px rgba(147, 51, 234, 0.8))",
          },
        },
        "card-hover": {
          "0%": {
            transform: "scale(1) translateY(0)",
          },
          "100%": {
            transform: "scale(1.05) translateY(-2px)",
          },
        },
        "pulse-gaming": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.02)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 0.6s ease-out",
        "elixir-glow": "elixir-glow 2s ease-in-out infinite alternate",
        "card-hover": "card-hover 0.3s ease-in-out",
        "pulse-gaming": "pulse-gaming 2s ease-in-out infinite",
      },
      backgroundImage: {
        'gaming-gradient-1': 'linear-gradient(135deg, hsl(228, 15%, 11%) 0%, hsl(220, 13%, 18%) 50%, hsl(228, 15%, 11%) 100%)',
        'gaming-gradient-2': 'linear-gradient(135deg, hsl(220, 13%, 18%) 0%, hsl(216, 10%, 31%) 100%)',
        'gaming-radial': 'radial-gradient(ellipse at center, hsl(220, 13%, 18%) 0%, hsl(228, 15%, 11%) 100%)',
      },
      boxShadow: {
        'gaming-card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'gaming-card-hover': '0 10px 15px -3px rgba(255, 107, 53, 0.2), 0 4px 6px -2px rgba(255, 107, 53, 0.1)',
        'elixir': '0 0 20px rgba(147, 51, 234, 0.4)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    // Custom plugin for gaming theme utilities
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        '.gaming-card-hover': {
          'transition': 'all 0.3s ease-in-out',
          '&:hover': {
            'transform': 'scale(1.02) translateY(-2px)',
            'box-shadow': theme('boxShadow.gaming-card-hover'),
            'border-color': theme('colors.game-orange'),
          }
        },
        '.elixir-cost-display': {
          'display': 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
          'width': '2rem',
          'height': '2rem',
          'border-radius': '50%',
          'background': 'linear-gradient(135deg, hsl(259, 100%, 65%) 0%, hsl(271, 91%, 65%) 100%)',
          'color': 'white',
          'font-weight': 'bold',
          'font-size': '0.875rem',
        },
        '.gaming-section': {
          'padding-top': theme('spacing.16'),
          'padding-bottom': theme('spacing.16'),
          '@media (min-width: 1024px)': {
            'padding-top': theme('spacing.24'),
            'padding-bottom': theme('spacing.24'),
          }
        },
        '.gaming-container': {
          'max-width': theme('maxWidth.7xl'),
          'margin-left': 'auto',
          'margin-right': 'auto',
          'padding-left': theme('spacing.4'),
          'padding-right': theme('spacing.4'),
          '@media (min-width: 640px)': {
            'padding-left': theme('spacing.6'),
            'padding-right': theme('spacing.6'),
          },
          '@media (min-width: 1024px)': {
            'padding-left': theme('spacing.8'),
            'padding-right': theme('spacing.8'),
          }
        }
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;
