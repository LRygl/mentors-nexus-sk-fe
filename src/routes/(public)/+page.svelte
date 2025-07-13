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
		<img src="https://source.unsplash.com/600x400/?education,online" alt="" class="rounded-2xl shadow-lg w-full" />
	</div>
</section>
<div>
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		Featured Items
	</h1>
	<FeaturedCourses />
</div>



<div class="relative group max-w-md rounded-2xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-md hover:shadow-xl transition-shadow duration-300">
	<div class="relative h-48 overflow-hidden">
		<img src="https://unsplash.com/photos/majestic-mountain-rises-above-a-green-meadow-Uf76Mk3LRXo" alt="Course Cover" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
		<div class="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
			Featured
		</div>
	</div>

	<div class="p-5 space-y-3">
		<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
			Fullstack Web Developer Bootcamp
		</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
			Learn to build modern web apps using HTML, CSS, JavaScript, React, and Node.js from scratch.
		</p>

		<div class="flex items-center gap-3">
			<img class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600" src="https://i.pravatar.cc/40?img=15" alt="Instructor">
			<span class="text-sm font-medium text-gray-800 dark:text-gray-300">Sarah Johnson</span>
		</div>

		<div class="flex items-center justify-between pt-2">
			<div class="flex items-center text-yellow-500 text-sm font-medium">
				★★★★☆ <span class="ml-1 text-gray-500 dark:text-gray-400">(4.8)</span>
			</div>
			<div class="text-right">
				<span class="text-lg font-bold text-green-600 dark:text-green-400">$59</span>
			</div>
		</div>

		<button class="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-blue-700 transition">
			Enroll Now
		</button>
	</div>
</div>
