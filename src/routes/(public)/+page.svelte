<script lang="ts">
	import HeroSection from "$lib/components/Sections/hero-section.svelte";
	import AboutSection from "$lib/components/Sections/about-section.svelte";

	import TestimonialsSection from "$lib/components/Sections/testimonials-section.svelte";
	import CategoriesSection from "$lib/components/Sections/categories-section.svelte";
	import CoursesSection from "$lib/components/Sections/courses-section.svelte";




</script>


<main class="snap-y snap-mandatory min-h-screen overflow-y-auto scroll-smooth scrollbar-none">
	<!-- Hero Section -->
	<HeroSection />
	<div class="w-screen max-w-7xl mx-auto">
		<CategoriesSection />
		<CoursesSection />

		<TestimonialsSection />
		<AboutSection />
	</div>
</main>
