<script lang="ts">
	import HeaderSection from "./header-section.svelte";
	import { categories } from '$lib/data/categories';
	import CategoryCard from '$lib/components/Cards/category-card.svelte';
</script>

<!-- Main Categories Section -->
<section class="relative py-24 overflow-hidden" aria-labelledby="testimonials-heading">
	<!-- Animated background gradient -->
	<div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/50"></div>

	<!-- Animated blob background -->
	<div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
	<div class="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-indigo-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<HeaderSection
			heading="Station Categories"
			subHeading="Choose from our wide range of professional services"
			showBadge={true}
			badgeText="Professional Services"
		/>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-16">
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