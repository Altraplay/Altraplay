import { preprocessMeltUI, sequence } from '@melt-ui/pp'
import adapter from 'svelte-adapter-bun'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'@components': './src/routes/components',
			'@DB': './database'
		}
	},
	preprocess: sequence([vitePreprocess(), preprocessMeltUI()])
}
export default config
