import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Use adapter-static to generate a fully static site (SPA mode).
		// The fallback page (200.html) is served for any unmatched route,
		// enabling client-side routing without a backend server.
		adapter: adapter({
			fallback: '200.html'
		})
	}
};

export default config;
