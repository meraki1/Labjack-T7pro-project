import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        '2': '0.5rem',
        '6': '1.5rem',
      },
      fontSize: {
        '5xl': '3rem',
      },
      colors: {
        'blue': {
          '200': 'lightblue',
          '800': 'darkblue',
        },
        'gray': {
          '700': 'gray',
          '800': 'gray',
        },
      },
      width: {
        '3/4': '75%',
      },
      borderWidth: {
        '2': '2px',
      },
      borderRadius: {
        'lg': '0.5rem',
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradientColors': {
          'blue-lightblue-white': 'linear-gradient(to right, blue, lightblue, white)',
        },
      },
    },
  },
  plugins: [],
}
export default config
