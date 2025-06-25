<script lang="ts">
	import FeaturedCourses from "$lib/components/featured-courses.svelte";
	import FeaturedCarousel from "\$lib/components/featured-carousel.svelte";
	import { Button } from '$lib/components/ui/button';
</script>



<!-- Hero Section -->
<section class="relative bg-blue-100 dark:bg-blue-950 py-20 w-screen max-w-none overflow-hidden -mx-[10vw] lg:-mx-[calc((100vw-100%)/2)] z-10">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4">
		<div>
			<h1 class="text-4xl md:text-5xl font-extrabold leading-tight text-gray-800 dark:text-white">
				Efective Fueling, Anywhere
			</h1>
			<p class="mt-4 text-lg text-gray-700 dark:text-gray-300">
				Unlock your potential with our expert-led online courses.
			</p>
			<div class="mt-6">

				<Button variant="default">Explore courses</Button>
				<Button variant="secondary">Explore courses</Button>

			</div>
		</div>
		<img src="https://source.unsplash.com/600x400/?education,online" alt="Hero Image" class="rounded-2xl shadow-lg w-full" />
	</div>
</section>
<div>
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		Featured Items
	</h1>
	<FeaturedCourses />
</div>
