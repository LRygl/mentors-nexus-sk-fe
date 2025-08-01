<script>
	import { onMount } from 'svelte';
	import { BarChart3, CirclePlus, Eye, TrendingUp, Users } from 'lucide-svelte';
	import { faqAdminStore } from '$lib/stores/faqAdminStore.svelte';

	let showAnalytics = $state(false);

	const loading = $state(faqAdminStore.isLoading);
	const error = $state(faqAdminStore.error);

	onMount(() => {
			loadFaqRecords();
	})

	async function loadFaqRecords() {

	}

</script>

<ul>
	{#each $faqAdminStore.faqs as faq}
		<li>
			<strong>{faq.question}</strong>
			<button onclick={() => faqAdminStore.deleteFAQ(faq.id)}>
				Delete
			</button>
		</li>
	{/each}
</ul>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">FAQ Categories</h1>
			<p class="mt-1 text-sm text-gray-600">
				Manage your FAQ categories and their content
			</p>
		</div>

		<div class="flex space-x-3">
			<button
				class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
				onclick={() => showAnalytics = !showAnalytics}
			>
				<BarChart3 class="w-4 h-4 mr-2" />
				Analytics
			</button>

			<button
				class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"

			>
				<CirclePlus class="w-4 h-4 mr-2" />
				Add Category
			</button>
		</div>
	</div>

	<!-- Analytics Cards -->
	{#if showAnalytics}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<Eye class="w-6 h-6 text-blue-600" />
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Total Categories</p>
						<p class="text-2xl font-bold text-gray-900">350</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<TrendingUp class="w-6 h-6 text-green-600" />
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Active Categories</p>
						<p class="text-2xl font-bold text-gray-900">68</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<Users class="w-6 h-6 text-purple-600" />
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Categories with FAQs</p>
						<p class="text-2xl font-bold text-gray-900">32</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
							<BarChart3 class="w-6 h-6 text-orange-600" />
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Avg FAQs per Category</p>
						<p class="text-2xl font-bold text-gray-900">8</p>
					</div>
				</div>
			</div>
		</div>
	{/if}


	<!-- Loading State -->
	{#if loading}
		<div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-12 text-center relative overflow-hidden">
			<!-- Subtle background gradient -->
			<div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30"></div>

			<!-- Modern spinner with pulsing effect -->
			<div class="relative z-10">
				<div class="inline-flex items-center justify-center">
					<div class="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-blue-600 shadow-sm"></div>
					<div class="absolute animate-ping rounded-full h-8 w-8 border-2 border-blue-400 opacity-20"></div>
				</div>

				<!-- Improved typography -->
				<div class="mt-6 space-y-2">
					<h3 class="text-lg font-semibold text-gray-900">Loading Categories</h3>
					<p class="text-sm text-gray-500 max-w-xs mx-auto">
						Please wait while we fetch your data...
					</p>
				</div>

				<!-- Progress dots animation -->
				<div class="flex justify-center space-x-1 mt-4">
					<div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
					<div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
					<div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Error State -->
	{#if error}
		<div class="bg-white rounded-2xl shadow-xl border border-red-100/50 p-8 relative overflow-hidden">
			<!-- Error background pattern -->
			<div class="absolute inset-0 bg-gradient-to-br from-red-50/40 to-rose-50/40"></div>

			<div class="relative z-10">
				<!-- Error icon with modern styling -->
				<div class="flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mx-auto mb-6">
					<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>

				<!-- Improved error messaging -->
				<div class="text-center space-y-3 mb-6">
					<h3 class="text-xl font-semibold text-gray-900">
						Unable to Load Categories
					</h3>
					<p class="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
						We encountered an issue while fetching your categories. This might be due to a temporary network problem.
					</p>

					<!-- Error details (optional, can be toggled) -->
					{#if error}
						<details class="mt-4 text-left">
							<summary class="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
								Technical details
							</summary>
							<div class="mt-2 p-3 bg-gray-50 rounded-lg border text-xs text-gray-700 font-mono">
								{error}
							</div>
						</details>
					{/if}
				</div>

				<!-- Modern action buttons -->
				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					<button
						class="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-100"

					>
						<svg class="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						Try Again
					</button>

					<button
						class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-100"

					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Go Back
					</button>
				</div>
			</div>
		</div>
	{/if}

</div>



<style>
    /* Custom border width for spinner */
    .border-3 {
        border-width: 3px;
    }

    /* Smooth animations */
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
        }
        40%, 43% {
            transform: translate3d(0,-8px,0);
        }
        70% {
            transform: translate3d(0,-4px,0);
        }
        90% {
            transform: translate3d(0,-2px,0);
        }
    }

    .animate-bounce {
        animation: bounce 1.4s ease-in-out infinite;
    }
</style>

