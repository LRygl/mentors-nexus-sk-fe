import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';


//DEV CONFIG
export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	],
	server: {
		host: true, // <-- REQUIRED
		port: 5173,
		strictPort: true,
		allowedHosts: true,
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				secure: false
			}
		}
	}
});

//PROD CONFIG
/*
export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	],
	server: {
		proxy: {
			// Proxy ALL API requests to Spring Boot backend
			// This makes cookies same-origin so they persist across page refreshes
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				secure: false
			}
		}
	}
});
*/
