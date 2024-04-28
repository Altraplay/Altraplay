/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: { DEFAULT: 'var(--Primary)', hover: 'var(--Primary-Hover)' },
				secondary: { DEFAULT: 'var(--Secondary)', hover: 'var(--Secondary-Hover)' },
				background: 'var(--BG)',
				highlight: {
					1: 'var(--Highlight-1)',
					2: 'var(--Highlight-2)'
				}
			}
		}
	},
	plugins: []
}
