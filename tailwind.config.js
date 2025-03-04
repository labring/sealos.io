import { createPreset } from 'fumadocs-ui/tailwind-plugin'

/** @type {import('tailwindcss').Config} */
export default {
	theme: {
		extend: {
			colors: {
				custom: {
					'primary-text': {
						DEFAULT: '#005b9c'
					},
					'secondary-text': {
						DEFAULT: '#4E6185'
					},
					bg: {
						DEFAULT: '#B2E3FF'
					},
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			boxShadow: {
				header: '0px 4px 40px -12px rgba(19, 51, 107, 0.20), 0px 0px 1px 0px rgba(19, 51, 107, 0.20)',
				'example-card': '0px 10px 30px -10px rgba(6, 26, 65, 0.05), 0px 0px 1px 0px rgba(19, 51, 107, 0.20)',
				'button': "0px 4px 4px 0px rgba(0, 103, 198, 0.15), 0px 0px 1px 0px rgba(19, 51, 107, 0.08)",
				'sticky-box': '0px 25.455px 42.424px -26.515px rgba(6, 26, 65, 0.20), 0px 0px 1.061px 0px rgba(19, 51, 107, 0.20);'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	content: [
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./content/**/*.{md,mdx}',
		'./mdx-components.{ts,tsx}',
		'./node_modules/fumadocs-ui/dist/**/*.js',
	],
	presets: [createPreset()],
	plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')]
}
