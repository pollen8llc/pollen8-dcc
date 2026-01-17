
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'royal-blue': {
          '50': '#f0f5fe',
          '100': '#dde9fc',
          '200': '#c2d9fb',
          '300': '#96c1f8',
          '400': '#639ff3',
          '500': '#4180ed',
          '600': '#2a61e1',
          '700': '#284fcd',
          '800': '#2541a5',
          '900': '#233a82',
          '950': '#1d264c',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center"
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center"
          }
        },
        // Avatar animations
        "avatar-pulse": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" }
        },
        "avatar-ring-expand": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.3" },
          "50%": { transform: "scale(1.2)", opacity: "0" }
        },
        "avatar-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "avatar-counter-rotate": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" }
        },
        "avatar-explode": {
          "0%": { transform: "scale(0.8)", opacity: "0.5" },
          "50%": { transform: "scale(1.3)", opacity: "0" },
          "100%": { transform: "scale(0.8)", opacity: "0.5" }
        },
        "avatar-glow": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.4" },
          "50%": { transform: "scale(1.15)", opacity: "0" }
        },
        "avatar-orbit": {
          "0%": { transform: "rotate(0deg) translateX(20px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(20px) rotate(-360deg)" }
        },
        "avatar-slow-pulse": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.7" }
        },
        "avatar-shimmer": {
          "0%": { "background-position": "-200% 0" },
          "100%": { "background-position": "200% 0" }
        },
        // Admin avatar animations - subtle purple-teal-white gradients
        "admin-sun-pulse": {
          "0%": { 
            "background": "linear-gradient(135deg, hsl(280, 70%, 60%), hsl(180, 70%, 60%))",
            "box-shadow": "0 0 20px hsl(280, 70%, 60% / 0.4)"
          },
          "50%": { 
            "background": "linear-gradient(135deg, hsl(180, 70%, 60%), hsl(280, 50%, 80%))",
            "box-shadow": "0 0 25px hsl(180, 70%, 60% / 0.6)"
          },
          "100%": { 
            "background": "linear-gradient(135deg, hsl(280, 70%, 60%), hsl(180, 70%, 60%))",
            "box-shadow": "0 0 20px hsl(280, 70%, 60% / 0.4)"
          }
        },
        "admin-border-pulse": {
          "0%": { 
            "border-color": "hsl(280, 70%, 60%)",
            "box-shadow": "0 0 0 1px hsl(280, 70%, 60% / 0.3)"
          },
          "50%": { 
            "border-color": "hsl(180, 70%, 60%)",
            "box-shadow": "0 0 0 2px hsl(180, 70%, 60% / 0.4)"
          },
          "100%": { 
            "border-color": "hsl(280, 70%, 60%)",
            "box-shadow": "0 0 0 1px hsl(280, 70%, 60% / 0.3)"
          }
        },
        "pulse-border": {
          "0%, 100%": { 
            "border-color": "hsl(var(--primary) / 0.2)",
            "box-shadow": "0 0 0 hsl(var(--primary) / 0)"
          },
          "50%": { 
            "border-color": "hsl(var(--primary) / 0.5)",
            "box-shadow": "0 0 8px hsl(var(--primary) / 0.15)"
          }
        },
        "pulse-border-teal": {
          "0%, 100%": { 
            "border-color": "hsl(174, 84%, 45% / 0.3)",
            "box-shadow": "0 0 0 hsl(174, 84%, 45% / 0)"
          },
          "50%": { 
            "border-color": "hsl(174, 84%, 45% / 0.7)",
            "box-shadow": "0 0 12px hsl(174, 84%, 45% / 0.25)"
          }
        },
        "gradient-border-celebration": {
          "0%": { 
            "border-color": "hsl(220, 90%, 60%)",
            "box-shadow": "0 0 12px hsl(220, 90%, 60% / 0.4)"
          },
          "25%": { 
            "border-color": "hsl(174, 84%, 50%)",
            "box-shadow": "0 0 16px hsl(174, 84%, 50% / 0.5)"
          },
          "50%": { 
            "border-color": "hsl(0, 0%, 100%)",
            "box-shadow": "0 0 20px hsl(0, 0%, 100% / 0.4)"
          },
          "75%": { 
            "border-color": "hsl(280, 70%, 60%)",
            "box-shadow": "0 0 16px hsl(280, 70%, 60% / 0.5)"
          },
          "100%": { 
            "border-color": "hsl(220, 90%, 60%)",
            "box-shadow": "0 0 12px hsl(220, 90%, 60% / 0.4)"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-x": "gradient-x 15s ease infinite",
        // Avatar animations
        "avatar-pulse": "avatar-pulse 1.5s ease-in-out infinite",
        "avatar-ring-expand": "avatar-ring-expand 1s ease-in-out infinite",
        "avatar-rotate": "avatar-rotate 2s linear infinite",
        "avatar-counter-rotate": "avatar-counter-rotate 1s linear infinite",
        "avatar-explode": "avatar-explode 2s ease-in-out infinite",
        "avatar-glow": "avatar-glow 4s ease-in-out infinite",
        "avatar-orbit": "avatar-orbit 3s linear infinite",
        "avatar-slow-pulse": "avatar-slow-pulse 4s ease-in-out infinite",
        "avatar-shimmer": "avatar-shimmer 3s ease-in-out infinite",
        "avatar-fast-rotate": "avatar-rotate 6s linear infinite",
        "pulse-border": "pulse-border 2s ease-in-out infinite",
        "pulse-border-teal": "pulse-border-teal 2s ease-in-out infinite",
        "gradient-border-celebration": "gradient-border-celebration 3s ease-in-out infinite",
        "avatar-slow-rotate": "avatar-rotate 10s linear infinite",
        "avatar-delayed-orbit": "avatar-orbit 3s linear infinite 1.5s",
        // Admin avatar animations - slow and subtle
        "admin-sun-pulse": "admin-sun-pulse 6s ease-in-out infinite",
        "admin-border-pulse": "admin-border-pulse 8s ease-in-out infinite"
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'var(--tw-prose-body)',
            '[class~="lead"]': {
              color: 'var(--tw-prose-lead)',
            },
            a: {
              color: 'hsl(var(--primary))',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            'a:hover': {
              opacity: '0.8',
            },
            strong: {
              color: 'var(--tw-prose-bold)',
              fontWeight: '600',
            },
            ul: {
              listStyleType: 'disc',
            },
            ol: {
              listStyleType: 'decimal',
            },
            'ul, ol': {
              paddingLeft: '1.625em',
            },
            blockquote: {
              borderLeftColor: 'hsl(var(--border))',
              borderLeftWidth: '0.25rem',
              fontStyle: 'italic',
              padding: '0.5rem 0 0.5rem 1.25rem',
              marginTop: '1.6em',
              marginBottom: '1.6em',
              opacity: '0.8',
            },
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
