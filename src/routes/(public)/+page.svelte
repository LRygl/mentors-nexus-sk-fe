<script lang="ts">
	import HeroSection from "$lib/components/Sections/Public/hero-section.svelte";
	import FeaturedCourses from '$lib/components/Sections/Public/FeaturedCourses.svelte';
	import { courseStore } from '$lib/stores/defaults/CourseStore.svelte';
	import { onMount } from 'svelte';
	import CTABannerComponent from '$lib/components/Sections/Public/CTABannerComponent.svelte';
	import { ctaBannerPresets as CTABannerConfig } from '$lib/Config/Components/CTABannerComponent/CTABannerConfig';

let courses = $derived(courseStore.featured)

	onMount(async () => {
		await courseStore.fetchFeatured();
	})

</script>


<main class="snap-y snap-mandatory min-h-screen overflow-y-auto scroll-smooth scrollbar-none">
	<!-- Hero Section -->
	<HeroSection />

	<FeaturedCourses {courses} />

	<CTABannerComponent
		{...CTABannerConfig.startLearning}
	/>
</main>
