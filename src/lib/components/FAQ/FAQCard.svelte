<!-- src/lib/components/FAQ/FAQCard.svelte -->
<script lang="ts">
	import type { FAQ } from '$lib/types/entities/faq';
	import { ChevronDown, ThumbsUp, ThumbsDown, Eye, Star } from 'lucide-svelte';
	import { faqActions } from '$lib/stores/faq-store';

	interface Props {
		faq: FAQ;
		isExpanded: boolean;
		onToggle: (id: string) => void;
		showAnalytics?: boolean;
	}

	let { faq, isExpanded, onToggle, showAnalytics = false }: Props = $props();

	function handleToggle() {
		onToggle(faq.id.toString());
	}

	async function handleVote(helpful: boolean) {
		await faqActions.voteFAQHelpful(faq.uuid, helpful);
	}
</script>

<div class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
	<!-- Question Header -->
	<button
		class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-t-xl"
		onclick={handleToggle}
		aria-expanded={isExpanded}
	>
		<div class="flex-1 pr-4">
			<div class="flex items-center gap-3 mb-2">
				{#if faq.isFeatured}
					<Star class="w-4 h-4 text-yellow-500 fill-current" />
				{/if}
				{#if faq.priority === 'HIGH' || faq.priority === 'URGENT'}
					<span class="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
						{faq.priority}
					</span>
				{/if}
				<span class="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
					{faq.categoryName}
				</span>
			</div>
			<h3 class="text-lg font-semibold text-gray-900 leading-tight">
				{faq.question}
			</h3>
			{#if showAnalytics}
				<div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
					<div class="flex items-center gap-1">
						<Eye class="w-4 h-4" />
						{faq.viewCount}
					</div>
					<div class="flex items-center gap-1">
						<ThumbsUp class="w-4 h-4" />
						{faq.helpfulVotes}
					</div>
				</div>
			{/if}
		</div>
		<ChevronDown
			class="w-5 h-5 text-gray-400 transition-transform duration-200 {isExpanded ? 'rotate-180' : ''}"
		/>
	</button>

	<!-- Answer Content -->
	{#if isExpanded}
		<div class="px-6 pb-6 border-t border-gray-100">
			<div class="prose prose-gray max-w-none mt-4">
				{@html faq.answer}
			</div>

			<!-- Voting Section -->
			<div class="mt-6 pt-4 border-t border-gray-100">
				<div class="flex items-center justify-between">
					<p class="text-sm text-gray-600">Was this helpful?</p>
					<div class="flex items-center gap-2">
						<button
							onclick={() => handleVote(true)}
							class="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
						>
							<ThumbsUp class="w-4 h-4" />
							Yes ({faq.helpfulVotes})
						</button>
						<button
							onclick={() => handleVote(false)}
							class="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
						>
							<ThumbsDown class="w-4 h-4" />
							No ({faq.notHelpfulVotes})
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>