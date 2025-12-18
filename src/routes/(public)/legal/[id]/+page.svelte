<script lang="ts">
	import { page } from '$app/state';
	import {
		Calendar,
		Clock,
		ChevronRight,
		FileText,
		HelpCircle,
		Edit,
		BookOpen,
		ChevronDown,
		Share2,
		Download,
		Printer,
		Check,
		Info,
		AlertCircle
	} from 'lucide-svelte';
	import { legalTopicStore } from '$lib/stores/defaults/LegalTopicStore.svelte';
	import { untrack } from 'svelte';
	import { onMount } from 'svelte';
	import BadgeComponent from '$lib/components/Sections/Public/BadgeComponent.svelte';
	import CTABannerComponent from '$lib/components/Sections/Public/CTABannerComponent.svelte';
	import { ctaBannerPresets as CRABannerConfig } from '$lib/Config/Components/CTABannerComponent/CTABannerConfig';

	let topic = $derived(legalTopicStore.selectedItem);
	let loading = $derived(legalTopicStore.loadingItem);
	let error = $derived(legalTopicStore.itemError);

	// Animation state
	let contentVisible = $state(false);
	let activeSection = $state<string | null>(null);
	let expandedSections = $state<Set<string>>(new Set());

	// Use $effect to reactively load topic when route changes
	$effect(() => {
		const id = page.params.id;
		console.log("Route changed, loading topic:", id);

		if (id) {
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

	// Trigger animations when content loads
	$effect(() => {
		if (topic && !loading) {
			setTimeout(() => {
				contentVisible = true;
			}, 100);
		}
	});

	// Intersection Observer for active section highlighting
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{ rootMargin: '-100px 0px -80% 0px' }
		);

		const sections = document.querySelectorAll('section[id^="section-"]');
		sections.forEach((section) => observer.observe(section));

		return () => observer.disconnect();
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

	function toggleSection(sectionId: string) {
		const newSet = new Set(expandedSections);
		if (newSet.has(sectionId)) {
			newSet.delete(sectionId);
		} else {
			newSet.add(sectionId);
		}
		expandedSections = newSet;
	}

	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			const offset = 100;
			const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
			window.scrollTo({
				top: elementPosition - offset,
				behavior: 'smooth'
			});
		}
	}

	// Action handlers
	function handleShare() {
		if (navigator.share) {
			navigator.share({
				title: topic?.name,
				text: topic?.subtitle,
				url: window.location.href
			});
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href);
			alert('Link copied to clipboard!');
		}
	}

	function handleDownload() {
		// Implement PDF download
		alert('Download feature coming soon!');
	}

	function handlePrint() {
		window.print();
	}
</script>

<svelte:head>
	{#if topic}
		<title>{topic.name} - Legal Documents</title>
		<meta name="description" content={topic.subtitle || topic.name} />
	{/if}
</svelte:head>

<div class="min-h-screen w-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
	{#if loading}
		<!-- Loading State -->
		<div class="relative min-h-screen flex items-center justify-center overflow-hidden">
			<!-- Animated Background -->
			<div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 opacity-50">
				<div class="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
				<div class="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
			</div>

			<div class="relative z-10 text-center">
				<div class="relative">
					<div class="h-16 w-16 mx-auto mb-6">
						<div class="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
						<div class="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
					</div>
				</div>
				<p class="text-lg font-medium text-gray-900 dark:text-white mb-2">Loading Document</p>
				<p class="text-sm text-gray-600 dark:text-gray-400">Please wait while we fetch the content...</p>
			</div>
		</div>

	{:else if error}
		<!-- Error State -->
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
			<div class="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 border border-red-200 dark:border-red-900/50 shadow-xl text-center">
				<div class="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
					<AlertCircle class="h-10 w-10 text-red-600 dark:text-red-400" />
				</div>
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Failed to Load Document</h2>
				<p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">{error}</p>
				<button
					onclick={() => window.location.reload()}
					class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
				>
					Try Again
				</button>
			</div>
		</div>

	{:else if topic}
		<!-- Hero Section -->
		<section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-16 md:py-24">
			<!-- Animated Background -->
			<div class="absolute inset-0 opacity-30">
				<div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
				<div class="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
			</div>

			<!-- Floating Particles -->
			<div class="absolute inset-0 overflow-hidden pointer-events-none">
				{#each Array(8) as _, i}
					<div
						class="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
						style="
							left: {Math.random() * 100}%;
							top: {Math.random() * 100}%;
							animation-delay: {Math.random() * 5}s;
							animation-duration: {3 + Math.random() * 4}s;
						"
					></div>
				{/each}
			</div>

			<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center space-y-6 mb-8 animate-fade-in-up">
					<BadgeComponent
						text="Legal Information"
						icon={FileText}
						variant="transparent"
						position="center"
					/>

					<h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
						{topic.name}
					</h1>

					{#if topic.subtitle}
						<p class="text-xl text-blue-100 font-light max-w-3xl mx-auto leading-relaxed">
							{topic.subtitle}
						</p>
					{/if}
				</div>

				<!-- Metadata Cards -->
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto animate-fade-in-up" style="animation-delay: 0.2s">
					{#if topic.effectiveAt}
						<div class="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
							<div class="flex items-center gap-3 mb-2">
								<div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
									<Calendar class="h-5 w-5 text-blue-300" />
								</div>
								<span class="text-xs font-semibold text-blue-200 uppercase tracking-wide">Effective Date</span>
							</div>
							<p class="text-lg font-bold text-white">{formatDate(topic.effectiveAt)}</p>
						</div>
					{/if}

					{#if topic.publishedAt}
						<div class="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
							<div class="flex items-center gap-3 mb-2">
								<div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
									<Clock class="h-5 w-5 text-purple-300" />
								</div>
								<span class="text-xs font-semibold text-blue-200 uppercase tracking-wide">Published</span>
							</div>
							<p class="text-lg font-bold text-white">{formatDateTime(topic.publishedAt)}</p>
						</div>
					{/if}

					{#if topic.updatedAt}
						<div class="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
							<div class="flex items-center gap-3 mb-2">
								<div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
									<Edit class="h-5 w-5 text-cyan-300" />
								</div>
								<span class="text-xs font-semibold text-blue-200 uppercase tracking-wide">Last Updated</span>
							</div>
							<p class="text-lg font-bold text-white">{formatDateTime(topic.updatedAt)}</p>
						</div>
					{/if}
				</div>
			</div>
		</section>

		<!-- Main Content -->
		<div class="relative -mt-8 pb-16">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="grid lg:grid-cols-12 gap-8">

					<!-- Sidebar: Table of Contents -->
					{#if topic.sections && topic.sections.length > 0}
						<aside class="lg:col-span-4 xl:col-span-3">
							<div class="lg:sticky lg:top-24 space-y-6">
								<!-- TOC Card -->
								<div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-200 dark:border-slate-700 shadow-xl animate-slide-in-left" class:opacity-100={contentVisible}>
									<div class="flex items-center gap-3 mb-6">
										<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
											<BookOpen class="h-5 w-5 text-white" />
										</div>
										<h2 class="text-lg font-bold text-gray-900 dark:text-white">
											Table of Contents
										</h2>
									</div>

									<nav class="space-y-2">
										{#each topic.sections as section, i}
											<button
												onclick={() => scrollToSection(`section-${section.id}`)}
												class="group w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 {activeSection === `section-${section.id}`
													? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-2 border-blue-500'
													: 'hover:bg-gray-100 dark:hover:bg-slate-700/50'}"
											>
												<span class="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5 min-w-[1.5rem]">
													{getSectionNumber(i)}
												</span>
												<span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white flex-1">
													{section.name}
												</span>
												<ChevronRight class="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
											</button>
										{/each}
									</nav>
								</div>

								<!-- Info Card -->
								<div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/50 animate-slide-in-left" class:opacity-100={contentVisible} style="animation-delay: 0.1s">
									<div class="flex items-start gap-3">
										<Info class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
										<div>
											<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
												Legal Notice
											</h3>
											<p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
												This document is for informational purposes. For legal advice, please consult a qualified attorney.
											</p>
										</div>
									</div>
								</div>
							</div>
						</aside>
					{/if}

					<!-- Main Content Area -->
					<main class="{topic.sections && topic.sections.length > 0 ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'}">
						<div class="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-slate-700 shadow-xl animate-fade-in-up" class:opacity-100={contentVisible}>

							{#if topic.sections && topic.sections.length > 0}
								<div class="space-y-12">
									{#each topic.sections as section, sectionIndex}
										<section id="section-{section.id}" class="scroll-mt-24 animate-slide-in" style="animation-delay: {0.1 + sectionIndex * 0.05}s">
											<!-- Section Header -->
											<div class="flex items-start gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-slate-700">
												{#if section.icon}
													<div class="text-4xl">{section.icon}</div>
												{/if}
												<div class="flex-1">
													<div class="flex items-center gap-3 mb-2">
														<span class="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-lg">
															{getSectionNumber(sectionIndex)}
														</span>
														<h2 class="text-3xl font-bold text-gray-900 dark:text-white">
															{section.name}
														</h2>
													</div>
													{#if section.subtitle}
														<p class="text-gray-600 dark:text-gray-400 mt-2">
															{section.subtitle}
														</p>
													{/if}
												</div>
											</div>

											<!-- Items -->
											{#if section.items && section.items.length > 0}
												<div class="space-y-8">
													{#each section.items as item, itemIndex}
														<div class="group">
															<!-- Item Header -->
															<div class="flex items-start gap-4 mb-4">
																<div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
																	<span class="text-sm font-bold text-blue-600 dark:text-blue-400">
																		{getItemNumber(sectionIndex, itemIndex)}
																	</span>
																</div>
																<div class="flex-1 prose prose-slate dark:prose-invert max-w-none">
																	<p class="text-gray-700 dark:text-gray-300 leading-relaxed m-0">
																		{item.content}
																	</p>
																</div>
															</div>

															<!-- Sub Items -->
															{#if item.subItems && item.subItems.length > 0}
																<div class="ml-12 mt-6 space-y-4 pl-6 border-l-2 border-blue-200 dark:border-blue-800">
																	{#each item.subItems as subItem, subItemIndex}
																		<div class="flex items-start gap-3">
																			<div class="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
																				<span class="text-xs font-bold text-purple-600 dark:text-purple-400">
																					{getSubItemNumber(sectionIndex, itemIndex, subItemIndex)}
																				</span>
																			</div>
																			<p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-1">
																				{subItem.content}
																			</p>
																		</div>
																	{/each}
																</div>
															{/if}
														</div>
													{/each}
												</div>
											{:else}
												<div class="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-8 text-center">
													<FileText class="h-12 w-12 text-gray-400 mx-auto mb-3" />
													<p class="text-gray-500 dark:text-gray-400 italic">No items in this section</p>
												</div>
											{/if}
										</section>
									{/each}
								</div>
							{:else}
								<div class="text-center py-16">
									<div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-6">
										<FileText class="h-10 w-10 text-gray-400" />
									</div>
									<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
										No Content Available
									</h3>
									<p class="text-gray-600 dark:text-gray-400">
										This document has no content yet
									</p>
								</div>
							{/if}

							<!-- Footer -->
							{#if topic.footer}
								<div class="mt-16 pt-12 border-t border-gray-200 dark:border-slate-700">
									<div class="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-900/20 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
										<div class="flex items-center gap-3 mb-6">
											<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
												<Info class="h-5 w-5 text-white" />
											</div>
											<h3 class="text-xl font-bold text-gray-900 dark:text-white">
												Additional Information
											</h3>
										</div>
										<div class="prose prose-slate dark:prose-invert max-w-none">
											{@html topic.footer}
										</div>
									</div>
								</div>
							{/if}
						</div>
					</main>
				</div>
			</div>
		</div>

		<!-- CTA Section -->
		{#if topic.showCta}
			<CTABannerComponent
				{...CRABannerConfig.support}
				title="Questions about this document?"
				description="Our support team is here to help clarify any points and answer your questions."
			/>
		{/if}

	{:else}
		<!-- Not Found State -->
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
			<div class="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-slate-700 shadow-xl text-center">
				<div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-6">
					<FileText class="h-10 w-10 text-gray-400" />
				</div>
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Document Found</h2>
				<p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
					The requested legal document could not be found or has been removed.
				</p>
				<button
					onclick={() => window.location.href = '/legal'}
					class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
				>
					View All Documents
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
    @keyframes float-particle {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }

    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-in-left {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }

    .animate-float-particle { animation: float-particle linear infinite; }
    .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; opacity: 0; }
    .animate-slide-in { animation: slide-in 0.8s ease-out forwards; opacity: 0; }
    .animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; opacity: 0; }

    /* Prose styling for dark mode */
    :global(.prose) {
        color: inherit;
    }

    :global(.dark .prose) {
        color: rgb(203 213 225);
    }

    :global(.prose a) {
        color: rgb(59 130 246);
        text-decoration: underline;
    }

    :global(.prose a:hover) {
        color: rgb(37 99 235);
    }

    :global(.prose strong) {
        color: inherit;
        font-weight: 600;
    }

    :global(.prose code) {
        background: rgb(241 245 249);
        padding: 0.125rem 0.375rem;
        border-radius: 0.375rem;
        font-size: 0.875em;
        font-weight: 500;
    }

    :global(.dark .prose code) {
        background: rgb(30 41 59);
    }

    /* Smooth scroll behavior */
    :global(html) {
        scroll-behavior: smooth;
    }

    /* Print styles */
    @media print {
        .no-print {
            display: none !important;
        }
    }
</style>