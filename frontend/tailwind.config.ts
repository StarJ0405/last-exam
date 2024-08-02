import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    screens: {
      PC: { min: '480px', max: '3840px' },
      Mobile: { min: '1px', max: '480px' }, 
    }
  },
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://localhost:8080/api/:path*'
			}
		]
	},
  daisyui: {
    themes: ["light"],
  },
  plugins: [require('daisyui'),],
};
export default config;
