<script lang="ts">
	import { Star, Clock, Heart, Users, Share2, Play, Award, BookOpen } from 'lucide-svelte';


	export let viewMode = 'grid';

	let isWishlisted = false;
	let enrollmentCount = 1247;
	let rating = 4.8;
	let totalReviews = 324;
	let isHovered = false;

</script>


{#if viewMode === 'grid'}
	<!-- Grid View Card -->
	<div
		class="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 border border-white/20 dark:border-gray-700/30"
		on:mouseenter={() => isHovered = true}
		on:mouseleave={() => isHovered = false}
		role="button"
		tabindex="0"
	>
		<!-- Image Container with Advanced Effects -->
		<div class="relative h-48 overflow-hidden">
			<img
				src="/thumbnail.jpg"
				alt="Course Thumbnail"
				class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
			/>

			<!-- Gradient Overlay -->
			<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

			<!-- Floating Action Buttons -->
			<div class="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
				<button
					class="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition-all duration-300"
					on:click={() => isWishlisted = !isWishlisted}
				>
					<Heart class="w-4 h-4 {isWishlisted ? 'text-red-500 fill-current' : ''}" />
				</button>
				<button class="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:scale-110 transition-all duration-300">
					<Share2 class="w-4 h-4" />
				</button>
			</div>

			<!-- Course Category Badge -->
			<div class="absolute top-3 left-3">
        <span class="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white rounded-full backdrop-blur-sm border border-white/20">
          EV Infrastructure
        </span>
			</div>

			<!-- Play Button Overlay -->
			<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
				<button class="w-16 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300">
					<Play class="w-6 h-6 text-blue-600 dark:text-blue-400 ml-1" />
				</button>
			</div>

			<!-- Progress Bar (if enrolled) -->
			<div class="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
				<div class="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style="width: 65%"></div>
			</div>
		</div>

		<!-- Card Content -->
		<div class="p-6 space-y-4">
			<!-- Instructor Info -->
			<div class="flex items-center gap-3 mb-3">
				<div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
					JD
				</div>
				<div>
					<p class="text-xs font-medium text-gray-600 dark:text-gray-400">Instructor</p>
					<p class="text-sm font-semibold text-gray-900 dark:text-white">Dr. John Davies</p>
				</div>
				<div class="ml-auto">
					<Award class="w-4 h-4 text-yellow-500" />
				</div>
			</div>

			<!-- Course Title -->
			<h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2">
				Advanced EV Charging Infrastructure & Smart Grid Integration
			</h3>

			<!-- Course Description -->
			<p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
				Master the complete ecosystem of EV infrastructure, from planning and deployment to smart grid integration and future-ready technologies.
			</p>

			<!-- Stats Row -->
			<div class="flex items-center justify-between text-xs">
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
						<Clock class="w-3.5 h-3.5" />
						<span class="font-medium">24h 15min</span>
					</div>
					<div class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
						<BookOpen class="w-3.5 h-3.5" />
						<span class="font-medium">12 modules</span>
					</div>
				</div>
				<div class="flex items-center gap-1">
					<Users class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
					<span class="text-gray-500 dark:text-gray-400 font-medium">{enrollmentCount.toLocaleString()}</span>
				</div>
			</div>

			<!-- Rating -->
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="flex items-center gap-1">
						{#each Array(5) as _, i}
							<Star class="w-4 h-4 {i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}" />
						{/each}
					</div>
					<span class="text-sm font-semibold text-gray-900 dark:text-white">{rating}</span>
					<span class="text-xs text-gray-500 dark:text-gray-400">({totalReviews})</span>
				</div>
				<div class="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">
					Best Seller
				</div>
			</div>

			<!-- Pricing and CTA -->
			<div class="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
				<div class="flex flex-col">
					<div class="flex items-baseline gap-2">
						<span class="text-xl font-bold text-gray-900 dark:text-white">€89</span>
						<span class="text-sm line-through text-gray-400">€129</span>
					</div>
					<span class="text-xs text-green-600 dark:text-green-400 font-medium">31% off</span>
				</div>

				<button class="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
					<span class="relative z-10">Enroll Now</span>
					<div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				</button>
			</div>
		</div>

		<!-- Hover Glow Effect -->
		<div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
	</div>
{:else}
	<!-- List View Card -->
	<div class="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/30">
		<div class="flex gap-6 p-6">
			<!-- Image -->
			<div class="relative w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden">
				<img
					src="/thumbnail.jpg"
					alt="Course Thumbnail"
					class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
				/>
				<div class="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white rounded-full">
					EV Infrastructure
				</div>
			</div>

			<!-- Content -->
			<div class="flex-1 space-y-3">
				<div class="flex items-start justify-between">
					<div>
						<h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
							Advanced EV Charging Infrastructure & Smart Grid Integration
						</h3>
						<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
							Master the complete ecosystem of EV infrastructure, from planning and deployment to smart grid integration.
						</p>
					</div>
					<button
						class="text-gray-400 hover:text-red-500 transition-colors"
						on:click={() => isWishlisted = !isWishlisted}
					>
						<Heart class="w-5 h-5 {isWishlisted ? 'text-red-500 fill-current' : ''}" />
					</button>
				</div>

				<div class="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
					<div class="flex items-center gap-1">
						<Clock class="w-4 h-4" />
						24h 15min
					</div>
					<div class="flex items-center gap-1">
						<Users class="w-4 h-4" />
						{enrollmentCount.toLocaleString()}
					</div>
					<div class="flex items-center gap-1">
						<Star class="w-4 h-4 text-yellow-400 fill-current" />
						{rating} ({totalReviews})
					</div>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-baseline gap-2">
						<span class="text-2xl font-bold text-gray-900 dark:text-white">€89</span>
						<span class="text-sm line-through text-gray-400">€129</span>
						<span class="text-sm text-green-600 dark:text-green-400 font-medium">31% off</span>
					</div>
					<button class="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300">
						Enroll Now
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}