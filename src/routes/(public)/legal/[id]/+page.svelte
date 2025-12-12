<script lang="ts">
	import { page } from '$app/state';
	import { Calendar, Clock, ChevronRight, FileText, HelpCircle, User, Edit } from 'lucide-svelte';
	import { legalTopicStore } from '$lib/stores/defaults/LegalTopicStore.svelte';
	import { untrack } from 'svelte';
	import HeaderSection from '$lib/components/Sections/Public/header-section.svelte';

	let topic = $derived(legalTopicStore.selectedItem);
	let loading = $derived(legalTopicStore.loadingItem);
	let error = $derived(legalTopicStore.itemError);

	// Use $effect to reactively load topic when route changes
	// React to route parameter changes
	$effect(() => {
		const id = page.params.id; // This is what we're tracking
		console.log("Route changed, loading topic:", id);

		if (id) {
			// Untrack the store operation to prevent infinite loops
			untrack(() => {
				legalTopicStore.loadItem(id);
			});
		}
	});

	// Cleanup on component unmount only
	$effect(() => {
		return () => {
			untrack(() => {
				legalTopicStore.clearSelection();
			});
		};
	});
	function formatDate(date: Date | string | undefined): string {
		if (!date) return '';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatDateTime(date: Date | string | undefined): string {
		if (!date) return '';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getSectionNumber(sectionIndex: number): string {
		return `${sectionIndex + 1}`;
	}

	function getItemNumber(sectionIndex: number, itemIndex: number): string {
		return `${sectionIndex + 1}.${itemIndex + 1}`;
	}

	function getSubItemNumber(sectionIndex: number, itemIndex: number, subItemIndex: number): string {
		return `${sectionIndex + 1}.${itemIndex + 1}.${subItemIndex + 1}`;
	}
</script>

<div class="min-h-screen min-w-7xl mx-auto">
	{#if loading}
		<div class="flex items-center justify-center min-h-[60vh]">
			<div class="text-center">
				<div class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
				<p class="text-muted-foreground">Loading document...</p>
			</div>
		</div>
	{:else if error}
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<div class="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
				<FileText class="h-12 w-12 text-destructive mx-auto mb-4" />
				<p class="text-destructive font-medium">Failed to load document</p>
				<p class="text-muted-foreground mt-2">{error}</p>
			</div>
		</div>
	{:else if topic}
		<!-- Header -->
		<div>
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

				<HeaderSection
					showBadge={true}
					badgeText="Legal Information"
					heading={topic.name}
					subHeading={topic.subtitle}
				/>

				<!-- Metadata Grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
					{#if topic.effectiveAt}
						<div class="flex items-start gap-3 p-3 bg-background/50 rounded-lg border">
							<Calendar class="h-5 w-5 text-primary mt-0.5" />
							<div>
								<p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Effective Date</p>
								<p class="text-sm font-medium">{formatDate(topic.effectiveAt)}</p>
							</div>
						</div>
					{/if}

					{#if topic.publishedAt}
						<div class="flex items-start gap-3 p-3 bg-background/50 rounded-lg border">
							<Clock class="h-5 w-5 text-primary mt-0.5" />
							<div>
								<p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Published</p>
								<p class="text-sm font-medium">{formatDateTime(topic.publishedAt)}</p>
							</div>
						</div>
					{/if}

					{#if topic.updatedAt}
						<div class="flex items-start gap-3 p-3 bg-background/50 rounded-lg border">
							<Edit class="h-5 w-5 text-primary mt-0.5" />
							<div>
								<p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Updated</p>
								<p class="text-sm font-medium">{formatDateTime(topic.updatedAt)}</p>
							</div>
						</div>
					{/if}
				</div>

			</div>
		</div>

		<!-- Content -->
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 py-12 bg-background/50 rounded-lg border">
			<!-- Table of Contents -->
			{#if topic.sections && topic.sections.length > 0}
				<div class="bg-muted/30 rounded-lg p-6 mb-12">
					<h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
						<FileText class="h-5 w-5" />
						Table of Contents
					</h2>
					<nav class="space-y-2">
						{#each topic.sections as section, i}
							<a href={`#section-${section.id}`}
														class="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
														>
														<ChevronRight class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
														<span>{getSectionNumber(i)}. {section.name}</span>
							</a>
						{/each}
					</nav>
				</div>
			{/if}

			<!-- Sections -->
			{#if topic.sections && topic.sections.length > 0}
				<div class="space-y-12">
					{#each topic.sections as section, sectionIndex}
						<section id="section-{section.id}" class="scroll-mt-8">
							<div class="flex items-start gap-3 mb-6">
								{#if section.icon}
									<div class="text-3xl mt-1">{section.icon}</div>
								{/if}
								<div class="flex-1">
									<h2 class="text-3xl font-bold mb-2 text-foreground">
										{getSectionNumber(sectionIndex)}. {section.name}
									</h2>
								</div>
							</div>

							<!-- Items -->
							{#if section.items && section.items.length > 0}
								<div class="space-y-6 ml-6">
									{#each section.items as item, itemIndex}
										<div class="pl-6 py-2">
											<h3 class="text-md mb-3 flex items-baseline gap-2">
												<span class="text-primary text-sm font-bold">
													{getItemNumber(sectionIndex, itemIndex)}
												</span>
												<span class="text-foreground text-justify">{item.content.split('\n')[0] || 'Untitled Item'}</span>
											</h3>

											<!-- Sub Items -->
											{#if item.subItems && item.subItems.length > 0}
												<div class="mt-6 ml-6 space-y-4">
													{#each item.subItems as subItem, subItemIndex}
														<div class="border-l-2 border-primary/30 pl-6 py-2">
															<h4 class="text-md mb-2 flex items-baseline gap-2">
																<span class="text-primary text-sm font-bold">
																	{getSubItemNumber(sectionIndex, itemIndex, subItemIndex)}
																</span>
																<span class="text-foreground">{subItem.content.split('\n')[0] || 'Untitled Sub-Item'}</span>
															</h4>

														</div>
													{/each}
												</div>
											{/if}
										</div>
									{/each}
								</div>
							{:else}
								<p class="text-muted-foreground italic ml-6">No items in this section</p>
							{/if}
						</section>
					{/each}
				</div>
			{:else}
				<div class="text-center py-12 bg-muted/30 rounded-lg">
					<FileText class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<p class="text-muted-foreground">This document has no content yet</p>
				</div>
			{/if}

			<!-- Footer -->
			{#if topic.footer}
				<div class="mt-16 pt-8 border-t">
					<div class="bg-muted/30 rounded-lg p-6">
						<h3 class="text-lg font-semibold mb-4">Additional Information</h3>
						<div class="prose prose-sm prose-slate dark:prose-invert max-w-none">
							{@html topic.footer}
						</div>
					</div>
				</div>
			{/if}

			<!-- CTA -->
			{#if topic.showCta}
				<div class="mt-12">
					<div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 border border-primary/20 text-center">
						<h3 class="text-xl font-semibold mb-4">Questions about this document?</h3>
						<p class="text-muted-foreground mb-6">
							Our support team is here to help clarify any points.
						</p>
						<button
							onclick={() => window.location.href = '/support'}
							class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
						>
							<HelpCircle class="h-4 w-4" />
							Contact Support
						</button>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
			<FileText class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
			<p class="text-muted-foreground font-medium mb-2">No document found</p>
			<p class="text-sm text-muted-foreground">The requested legal document could not be found or has been removed.</p>
		</div>
	{/if}
</div>

<style>
    :global(.prose h2) {
        scroll-margin-top: 2rem;
    }

    :global(.prose) {
        color: inherit;
    }

    :global(.prose a) {
        color: hsl(var(--primary));
        text-decoration: underline;
    }

    :global(.prose a:hover) {
        color: hsl(var(--primary) / 0.8);
    }

    :global(.prose strong) {
        color: inherit;
        font-weight: 600;
    }

    :global(.prose code) {
        background: hsl(var(--muted));
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-size: 0.875em;
    }
</style>