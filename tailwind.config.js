/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#59b0ff',
          500: '#338eff',
          600: '#1b6ef5',
          700: '#1457e1',
          800: '#1746b6',
          900: '#193f8f',
          950: '#142857',
        },
        accent: {
          50: '#fff4ed',
          100: '#ffe6d5',
          200: '#feccaa',
          300: '#fdac74',
          400: '#fb8a3c',
          500: '#f97316',
          600: '#ea5b0c',
          700: '#c2440c',
          800: '#9a3712',
          900: '#7c3012',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Microsoft YaHei"', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
