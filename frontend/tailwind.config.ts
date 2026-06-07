import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'amazon-dark': '#131921',
        'amazon-light': '#232F3E',
        'amazon-orange': '#FF9900',
        'amazon-yellow': '#FEBD69',
        'amazon-bg': '#EAEDED',
        'surya-dark': '#0F3D6E',
        'surya-light': '#5DADE2',
        'surya-blue': '#2E86DE',
      },
    },
  },
  plugins: [],
};

export default config;
