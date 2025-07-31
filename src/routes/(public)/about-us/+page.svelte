<script lang="ts">
	import HeaderSection from '\$lib/components/Sections/header-section.svelte';
	import { translation } from '$lib/stores/internalization-store';
</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-gray-800 dark:text-gray-100">
	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<HeaderSection
			heading={$translation.page.about_us.title}
			subHeading={$translation.page.about_us.subTitle}
			showBadge={true}
			badgeText="Legal"
		/>
	</div>

</section>