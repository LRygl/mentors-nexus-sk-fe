<script lang="ts">
	import MainNav from "$lib/components/main-nav.svelte";
	import Banner from "$lib/components/banner.svelte";
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

<Banner {...bannerContent } />
<MainNav />
<ModeWatcher />

<main class="flex flex-col items-center min-h-screen">
	<div class="w-4/5 max-w-4xl">
		{@render children()}
	</div>
</main>
