<script lang="ts">
	import HeaderSection from "./header-section.svelte";
	import { categories } from '$lib/data/categories';
	import CategoryCard from '$lib/components/Cards/category-card.svelte';
</script>

<section class="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden" aria-labelledby="testimonials-heading">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

	<HeaderSection heading="Station Categories" subHeading="Choose from our wide range of professional services" />

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
			{#each categories as category}
				<CategoryCard
					{category}
				/>
			{/each}
		</div>
	</div>
</section>