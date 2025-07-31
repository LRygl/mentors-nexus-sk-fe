<!-- src/lib/components/FAQ/FAQCard.svelte -->
<script lang="ts">
	import { ChevronDown, ChevronUp, Star, Eye, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import type { FAQ, FAQPriority } from '$lib/types/faq';
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

		// Track view when FAQ is expanded
		if (!isExpanded) {
			faqActions.trackFAQView(faq.id);
		}
	}

	// Format the answer with basic HTML support
	function formatAnswer(answer: string): string {
		return answer.replace(/\n/g, '<br>');
	}

	// Get priority badge styling
	function getPriorityBadge(priority: FAQPriority) {
		switch (priority) {
			case 'CRITICAL':
				return { class: 'bg-red-100 text-red-800', text: 'Critical' };
			case 'HIGH':
				return { class: 'bg-orange-100 text-orange-800', text: 'High Priority' };
			case 'NORMAL':
				return { class: 'bg-blue-100 text-blue-800', text: 'Normal' };
			case 'LOW':
				return { class: 'bg-gray-100 text-gray-800', text: 'Low Priority' };
			default:
				return { class: 'bg-gray-100 text-gray-800', text: 'Normal' };
		}
	}

	// Calculate helpfulness percentage
	function getHelpfulnessPercentage(): number {
		const total = faq.helpfulVotes + faq.notHelpfulVotes;
		if (total === 0) return 0;
		return Math.round((faq.helpfulVotes / total) * 100);
	}

	const priorityBadge = getPriorityBadge(faq.priority);
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
	<!-- Question Header -->
	<button
		onclick={handleToggle}
		class="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 rounded-t-xl transition-colors duration-200"
		aria-expanded={isExpanded}
	>
		<div class="flex-1 pr-4">
			<div class="flex items-start gap-3">
				<!-- Priority Indicator -->
				{#if faq.priority !== 'NORMAL'}
					<div class="flex-shrink-0 mt-1">
						<AlertCircle class={`w-4 h-4 ${
              faq.priority === 'CRITICAL' ? 'text-red-500' :
              faq.priority === 'HIGH' ? 'text-orange-500' : 'text-gray-500'
            }`} />
					</div>
				{/if}

				<div class="flex-1">
					<h3 class="text-lg font-semibold text-gray-900 leading-relaxed">
						{faq.question}
					</h3>

					<!-- Badges and Metadata -->
					<div class="mt-3 flex items-center gap-2 flex-wrap">
						<!-- Category Badge -->
						<span
							class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-nexus-primary-100 text-nexus-primary-800"
							style={faq.category.colorCode ? `background-color: ${faq.category.colorCode}20; color: ${faq.category.colorCode}` : ''}
						>
              {#if faq.category.iconClass}
                <i class={`${faq.category.iconClass} mr-1`}></i>
              {/if}
							{faq.category.name}
            </span>

						<!-- Featured Badge -->
						{#if faq.isFeatured}
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Star class="w-3 h-3" />
                Featured
              </span>
						{/if}

						<!-- Priority Badge (for non-normal priorities) -->
						{#if faq.priority !== 'NORMAL'}
              <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityBadge.class}`}>
                {priorityBadge.text}
              </span>
						{/if}

						<!-- Popular Badge -->
						{#if faq.isPopular}
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Eye class="w-3 h-3" />
                Popular
              </span>
						{/if}
					</div>

					<!-- Analytics (if enabled) -->
					{#if showAnalytics}
						<div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <Eye class="w-3 h-3" />
								{faq.viewCount} views
              </span>
							{#if faq.helpfulVotes > 0 || faq.notHelpfulVotes > 0}
                <span class="flex items-center gap-1">
                  <ThumbsUp class="w-3 h-3" />
									{getHelpfulnessPercentage()}% helpful
                </span>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Expand/Collapse Icon -->
		<div class="flex-shrink-0 ml-4">
			<div class="w-8 h-8 flex items-center justify-center rounded-full bg-nexus-primary-50 text-nexus-primary transition-all duration-200">
				{#if isExpanded}
					<ChevronUp class="w-4 h-4" />
				{:else}
					<ChevronDown class="w-4 h-4" />
				{/if}
			</div>
		</div>
	</button>

	<!-- Answer Content -->
	{#if isExpanded}
		<div
			class="px-6 pb-6 border-t border-gray-100"
			transition:slide={{ duration: 200 }}
		>
			<div class="pt-4 prose prose-sm max-w-none text-gray-700 leading-relaxed">
				{@html formatAnswer(faq.answer)}
			</div>

			<!-- SEO Keywords (if available) -->
			{#if faq.searchKeywords}
				<div class="mt-4 pt-4 border-t border-gray-100">
					<div class="flex items-center gap-2 flex-wrap">
						<span class="text-sm font-medium text-gray-600">Related topics:</span>
						{#each faq.searchKeywords.split(',').map(k => k.trim()).filter(k => k) as keyword}
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-nexus-primary-50 hover:text-nexus-primary-700 transition-colors duration-200">
                {keyword}
              </span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Helpfulness Voting (if analytics enabled) -->
			{#if showAnalytics}
				<div class="mt-4 pt-4 border-t border-gray-100">
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-gray-600">Was this helpful?</span>
						<div class="flex items-center gap-2">
							<button class="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
								<ThumbsUp class="w-4 h-4" />
								Yes ({faq.helpfulVotes})
							</button>
							<button class="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
								<ThumbsDown class="w-4 h-4" />
								No ({faq.notHelpfulVotes})
							</button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Last Updated -->
			<div class="mt-4 text-xs text-gray-400">
				Last updated: {new Date(faq.updatedAt).toLocaleDateString()}
			</div>
		</div>
	{/if}
</div>