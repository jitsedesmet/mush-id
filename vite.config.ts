import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import {SvelteKitPWA} from "@vite-pwa/sveltekit";

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter({
				fallback: '200.html'
			})
		}),
		SvelteKitPWA({/* pwa options */})
	],
	define: {
		'process.env.NODE_ENV': '"production"',
	}
});
