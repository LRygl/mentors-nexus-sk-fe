<script lang="ts">
	import MainNav from "$lib/components/main-nav.svelte";
	import Banner from "$lib/components/banner.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { ModeWatcher } from 'mode-watcher';


	let { children } = $props();

	const bannerContent = {
		visible: false,
		dismissable: true,
		heading: 'Test Heading Content',
		headingSeparator: '*',
		paragraph: 'Test Paragraph Content',
		callToAction: false,
		callToActionLabel: 'Call to Action',
		callToActionLink: '/admin/ideas'
	}
</script>

<!-- Fullscreen wrapper for stacking -->
<div class="relative min-h-screen overflow-hidden bg-transparent">

	<!-- 🔮 Full-page gradient background layer -->
	<div class="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50
		dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/50">
	</div>

	<!-- 🔮 Animated blobs -->
	<div class="absolute top-0 right-0 w-96 h-96 -z-10 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
	<div class="absolute bottom-0 left-0 w-72 h-72 -z-10 bg-gradient-to-tr from-indigo-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

	<!-- 🌐 Main app content -->
	<Banner {...bannerContent} />
	<MainNav />
	<ModeWatcher />

	<main class="flex flex-col items-center bg-transparent relative z-10">
		{@render children()}
	</main>

	<Footer />
</div>