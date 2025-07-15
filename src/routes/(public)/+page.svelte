<script lang="ts">
	import FeaturedCourses from "$lib/components/featured-courses.svelte";
	import FeaturedCarousel from "\$lib/components/featured-carousel.svelte";
	import { Button } from '$lib/components/ui/button';
</script>



<!-- Hero Section -->
<section class="relative bg-blue-100 dark:bg-blue-950 py-20 w-screen max-w-none overflow-hidden -mx-[10vw] lg:-mx-[calc((100vw-100%)/2)] z-10">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:flex lg:items-center lg:justify-between">
		<!-- Text content -->
		<div class="text-center lg:text-left">
			<h1 class="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
				Launch smarter, grow faster
			</h1>
			<p class="mt-6 text-lg text-gray-600">
				Supercharge your product with our all-in-one platform built for speed,
				scalability, and modern teams.
			</p>

			<div class="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
				<a
					href="#"
					class="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-2xl text-white bg-indigo-600 shadow-lg hover:bg-indigo-500 transition duration-300"
				>
					🚀 Get Started
				</a>
				<a
					href="#"
					class="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-2xl text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition duration-300"
				>
					Learn More →
				</a>
			</div>
		</div>

		<!-- Image or illustration -->
		<div class="mt-16 lg:mt-0 lg:ml-16 relative">
			<div class="absolute -inset-2 bg-indigo-100 rounded-3xl blur-2xl opacity-30 animate-pulse hidden lg:block"></div>
			<img
				src="https://source.unsplash.com/600x400/?dashboard,analytics"
				alt="Dashboard preview"
				class="relative w-full max-w-md mx-auto rounded-2xl shadow-xl ring-1 ring-gray-200"
			/>
		</div>
	</div>
</section>

<section class="relative bg-gradient-to-br from-indigo-50 via-white to-white overflow-hidden w-screen max-w-none overflow-hidden -mx-[10vw] lg:-mx-[calc((100vw-100%)/2)] z-10">

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
