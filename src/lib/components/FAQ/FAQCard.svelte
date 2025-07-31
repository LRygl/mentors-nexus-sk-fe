<!-- components/FAQ/FAQCard.svelte -->
<script lang="ts">
	import { ChevronDown, ChevronUp, Hash } from 'lucide-svelte';
	import type { FAQItem } from '$lib/types/faq.js';

	interface Props {
		faq: FAQItem;
		isExpanded: boolean;
		onToggle: (id: string) => void;
	}

	let { faq, isExpanded, onToggle }: Props = $props();
</script>

<div class="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] hover:-translate-y-1 {isExpanded ? 'shadow-2xl scale-[1.01] -translate-y-1' : 'shadow-lg'}">
	<!-- Gradient border effect -->
	<div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

	<!-- Question button -->
	<button
		onclick={() => onToggle(faq.id)}
		class="relative w-full p-8 text-left flex items-start justify-between hover:bg-white/50 dark:hover:bg-gray-700/20 transition-all duration-300 group/button"
	>
		<!-- Question content -->
		<div class="flex-1 pr-6">
			<!-- Question number indicator -->
			<div class="flex items-start gap-4 mb-2">
				<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group/button-hover:scale-110 transition-transform duration-300">
					<Hash class="w-4 h-4 text-white" />
				</div>

				<!-- Question text -->
				<h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 leading-relaxed group/button-hover:text-blue-600 dark:group/button-hover:text-blue-400 transition-colors duration-300">
					{faq.question}
				</h3>
			</div>
		</div>

		<!-- Chevron with rotation animation -->
		<div class="flex-shrink-0 mt-2">
			<div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group/button-hover:bg-blue-100 dark:group/button-hover:bg-blue-900/30 group/button-hover:scale-110 transition-all duration-300">
				{#if isExpanded}
					<ChevronUp class="w-5 h-5 text-gray-600 dark:text-gray-400 group/button-hover:text-blue-600 dark:group/button-hover:text-blue-400 transition-all duration-300 animate-bounce-subtle" />
				{:else}
					<ChevronDown class="w-5 h-5 text-gray-600 dark:text-gray-400 group/button-hover:text-blue-600 dark:group/button-hover:text-blue-400 transition-all duration-300" />
				{/if}
			</div>
		</div>
	</button>

	<!-- Expandable answer section -->
	{#if isExpanded}
		<div class="px-8 pb-8 border-t border-gray-200/50 dark:border-gray-700/50 animate-fade-in-down">
			<div class="pt-6">
				<!-- Answer text with better typography -->
				<div class="prose prose-lg dark:prose-invert max-w-none mb-6">
					<p class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
						{faq.answer}
					</p>
				</div>

				<!-- Enhanced tags section -->
				{#if faq.tags.length > 0}
					<div class="border-t border-gray-200/30 dark:border-gray-700/30 pt-6">
						<h4 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
							Related Topics
						</h4>
						<div class="flex flex-wrap gap-2">
							{#each faq.tags as tag, index}
								<button
									onclick={() => {/* Handle tag click if needed */}}
									class="group/tag inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-700/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md hover:scale-105 transition-all duration-300 animate-fade-in-up"
									style="animation-delay: {index * 100}ms;"
								>
									<!-- Tag icon -->
									<div class="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group/tag-hover:scale-125 transition-transform duration-300"></div>

									<!-- Tag text -->
									<span class="group/tag-hover:translate-x-0.5 transition-transform duration-300">
                    {tag}
                  </span>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Shine effect on hover -->
	<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
</div>

<!-- Custom CSS Animations -->
<style>
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }

    @keyframes shine {
        0% { transform: translateX(-100%) skewX(-15deg); }
        100% { transform: translateX(200%) skewX(-15deg); }
    }

    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fade-in-down {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes bounce-subtle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
    }

    .animate-shimmer {
        animation: shimmer 2s infinite;
    }

    .animate-shine {
        animation: shine 1.5s ease-out;
    }

    .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out both;
    }

    .animate-fade-in-down {
        animation: fade-in-down 0.4s ease-out both;
    }

    .animate-bounce-subtle {
        animation: bounce-subtle 2s infinite;
    }
</style>