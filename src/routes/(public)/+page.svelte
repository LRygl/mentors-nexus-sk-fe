<script lang="ts">
	import HeroSection from "$lib/components/Sections/Public/hero-section.svelte";
	import FeaturedCourses from '$lib/components/Sections/Public/FeaturedCourses.svelte';
	import { courseStore } from '$lib/stores/defaults/CourseStore.svelte';
	import { onMount } from 'svelte';

let courses = $derived(courseStore.featured)

	onMount(async () => {
		await courseStore.fetchFeatured();
	})

</script>


<main class="snap-y snap-mandatory min-h-screen overflow-y-auto scroll-smooth scrollbar-none">
	<!-- Hero Section -->
	<HeroSection />

	<FeaturedCourses {courses} />
	<div class="w-screen max-w-7xl mx-auto">

	</div>
</main>
