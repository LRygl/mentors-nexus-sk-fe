<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../../app.css';
	import MainNav from '$lib/components/main-nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { ModeWatcher } from 'mode-watcher';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<!-- Same wrapper as public layout -->
<div class="relative min-h-screen overflow-hidden bg-transparent">
	<!-- Gradient background -->
	<div class="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950"></div>

	<!-- Animated blobs -->
	<div class="absolute top-0 right-0 w-96 h-96 -z-10 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
	<div class="absolute bottom-0 left-0 w-72 h-72 -z-10 bg-gradient-to-tr from-indigo-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

	<MainNav />
	<ModeWatcher />

	<main class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
		<!-- Page Content -->
		<div class="mt-6">
			{@render children()}
		</div>
	</main>

	<Footer />
</div>
