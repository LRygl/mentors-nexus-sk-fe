<script lang="ts">

import { Button } from '$lib/components/ui/button';
</script>

<section class="relative w-screen bg-gradient-to-bl from-violet-500 to-fuchsia-500">
	<div class="max-w-7xl mx-auto px-4 lg:px-8 py-24 lg:flex lg:items-center lg:justify-between">
		<!-- Text content -->
		<div class="">
			<h1 class="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
				Build. Launch.
				<span class="bg-gradient-to-r from-indigo-500 to-indigo-900 bg-clip-text text-transparent">
					Scale.
				</span>
				Without Limits.
			</h1>
			<p class="mt-6 text-lg text-gray-200 leading-tight">
				Build blazing-fast products with less friction. Our modern development platform helps you ship faster, collaborate better, and grow with confidence.
			</p>

			<div class="mt-24 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
				<Button class="px-6 py-3 h-14 inline-flex items-center justify-center rounded-2xl text-base font-semibold text-white bg-indigo-600 shadow-lg hover:bg-indigo-500 transition duration-300" variant="default" size="lg">🚀 Get Started</Button>
				<Button class="px-6 py-3 h-14 inline-flex items-center justify-center rounded-2xl text-base font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition duration-300" variant="outline" size="lg">Learn More →</Button>
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