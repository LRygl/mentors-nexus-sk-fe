<script lang="ts">
	import { Star, Clock } from 'lucide-svelte';

</script>

<div class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-[1.02] w-full max-w-sm">
	<div class="relative h-40 sm:h-44 md:h-48 lg:h-52 overflow-hidden">
		<img
			src="/thumbnail.jpg"
			alt="Course Thumbnail"
			class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
		/>
		<div class="absolute top-2 left-2 px-2.5 py-1 text-xs font-medium bg-black/60 text-white rounded-full backdrop-blur-sm">
			EV Charging
		</div>
	</div>

	<div class="p-4 space-y-3">
		<h3 class="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
			West Ham EV Charging Course
		</h3>

		<p class="text-sm text-gray-600 line-clamp-3 leading-relaxed">
			Learn the fundamentals of EV infrastructure, planning, and deployment at city scale with industry experts.
		</p>

		<!-- Meta Row with Instructor -->
		<div class="flex flex-wrap items-center justify-between text-xs text-gray-500 gap-y-2">
			<div class="flex items-center gap-1">
				<Clock class="w-4 h-4" />
				12h 34min
			</div>
			<div class="flex items-center gap-1">
				<Star class="w-4 h-4 text-yellow-400 fill-current" />
				3/3
			</div>
			<div class="flex items-center gap-1">
				👥 120
			</div>

		</div>

		<!-- Pricing + CTA -->
		<div class="flex items-center justify-between pt-2">
			<div>
				<span class="text-base font-bold text-gray-900">2800 Kč</span>
				<span class="ml-1 text-xs line-through text-gray-400">3500 Kč</span>
			</div>

			<button class="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all hover:scale-105">
				Enroll Now
			</button>
		</div>
	</div>
</div>