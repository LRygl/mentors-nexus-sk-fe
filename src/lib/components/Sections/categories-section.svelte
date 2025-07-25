<script lang="ts">
	import HeaderSection from "./header-section.svelte";
	import { categories } from '$lib/data/categories';
	import CategoryCard from '$lib/components/Cards/category-card.svelte';
</script>

<!-- Main Categories Section -->
<section class="relative py-24 overflow-hidden bg-transparent" aria-labelledby="testimonials-heading">
	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<HeaderSection
			heading="Station Categories"
			subHeading="Choose from our wide range of professional services"
			showBadge={true}
			badgeText="Professional Services"
		/>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-16 ">
			{#each categories as category, index}
				<div style="animation-delay: {index * 100}ms" class="animate-fade-in-up">
					<CategoryCard {category} />
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out forwards;
        opacity: 0;
    }
</style>