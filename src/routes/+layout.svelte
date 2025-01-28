<script lang="ts">
	import "../app.css";
	import MainNav from "$lib/components/main-nav.svelte";
	import Banner from "$lib/components/banner.svelte";

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
<MainNav/>
<slot/>



<style>

</style>