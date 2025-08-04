<script lang="ts">
	import MainNav from "$lib/components/main-nav.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { ModeWatcher } from 'mode-watcher';


	let { children } = $props();


</script>

<!-- Fullscreen wrapper for stacking -->
<div class="relative min-h-screen overflow-hidden bg-transparent">

	<!-- 🔮 Full-page gradient background layer -->
	<div class="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">

	</div>

	<!-- 🔮 Animated blobs -->
	<div class="absolute top-0 right-0 w-96 h-96 -z-10 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
	<div class="absolute bottom-0 left-0 w-72 h-72 -z-10 bg-gradient-to-tr from-indigo-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

	<!-- 🌐 Main app content -->
	<MainNav />
	<ModeWatcher />

	<main class="flex flex-col items-center bg-transparent relative z-10">
		{@render children()}
	</main>

	<Footer />
</div>