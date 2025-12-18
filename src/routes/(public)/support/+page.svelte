<script lang="ts">
	import {
		MessageSquare,
		Mail,
		Search,
		ChevronDown,
		ThumbsUp,
		ThumbsDown,
		BookOpen,
		Headphones,
		FileText,
		ExternalLink,
		CheckCircle2,
		Info,
		Zap,
		Users,
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import BadgeComponent from '$lib/components/Sections/Public/BadgeComponent.svelte';
	import { FAQPublicStore } from '$lib/stores/defaults/FAQPublicStore.svelte';
	import type { FAQCategory } from '$lib/types/entities/faqCategory';
	import { faqPublicAPI } from '$lib/API/Public/FAQPublicAPI';
	import type { FAQ } from '$lib/types';

	let faqCategories: FAQCategory[] = $derived(FAQPublicStore.data)
	let userVotes = $state<Map<string, 'up' | 'down'>>(new Map());
	let votesLoaded = $state(false);

	onMount(async (): Promise<void> => {
		// Load saved votes FIRST
		const savedVotes = localStorage.getItem('faq-votes');
		if (savedVotes) {
			try {
				userVotes = new Map(JSON.parse(savedVotes));
			} catch (e) {
				console.error('Failed to parse saved votes:', e);
			}
		}
		votesLoaded = true;

		await FAQPublicStore.fetchAll();
	});


	$effect(() => {
		if (votesLoaded) {
			const votesArray = Array.from(userVotes.entries());
			localStorage.setItem('faq-votes', JSON.stringify(votesArray));
		}
	});

	// Quick help links
	const quickLinks = [
		{ icon: BookOpen, text: 'Getting Started Guide', href: '#' },
		{ icon: FileText, text: 'Documentation', href: '#' },
		{ icon: Users, text: 'Community Forum', href: '#' },
		{ icon: Info, text: 'System Status', href: '#' }
	];

	// State management
	let searchQuery = $state('');
	let selectedCategory = $state<string | null>(null);
	let expandedItems = $state<Set<string>>(new Set());
	let animationTriggered = $state(false);

	// Search and filter logic
	const filteredCategories = $derived(() => {
		if (!searchQuery.trim() && !selectedCategory) {
			return faqCategories;
		}

		return faqCategories
			.map(category => {
				// Filter by selected category
				if (selectedCategory && category.id !== selectedCategory) {
					return null;
				}

				// Filter items by search query
				const filteredItems = category.faqs.filter(item =>
					item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.answer.toLowerCase().includes(searchQuery.toLowerCase())
				);

				if (filteredItems.length === 0) {
					return null;
				}

				return { ...category, items: filteredItems };
			})
			.filter(Boolean) as FAQCategory[];
	});

	// Toggle FAQ item
	async function toggleItem(itemUuid: string) {
		faqPublicAPI.recordFAQView(itemUuid);
		const newSet = new Set(expandedItems);
		if (newSet.has(itemUuid)) {
			newSet.delete(itemUuid);
		} else {
			newSet.add(itemUuid);
		}
		expandedItems = newSet;
	}

	// Vote handling
	async function handleVote(faqUuid: string, voteType: 'up' | 'down') {
		try {
			// Check current vote state
			const currentVote = userVotes.get(faqUuid);
			const isTogglingOff = currentVote === voteType;

			// Determine what to send to backend
			const helpful = voteType === 'up';

			// Update local vote tracking
			if (isTogglingOff) {
				// User is removing their vote
				userVotes.delete(faqUuid);
			} else {
				// User is voting (new vote or changing vote)
				userVotes.set(faqUuid, voteType);
			}

			// Trigger reactivity
			userVotes = new Map(userVotes);

			// Call backend API
			await faqPublicAPI.voteFAQ(faqUuid, helpful);

			// Optionally refresh to get updated vote counts
			await FAQPublicStore.fetchAll();

		} catch (error) {
			console.error('Failed to vote:', error);
			// Rollback local state on error
			if (currentVote) {
				userVotes.set(faqUuid, currentVote);
			} else {
				userVotes.delete(faqUuid);
			}
			userVotes = new Map(userVotes);
		}
	}

	// Calculate helpfulness percentage
	function getHelpfulnessPercentage(item: FAQ): number {
		const total = item.helpfulVotes + item.notHelpfulVotes;
		if (total === 0) return 0;
		return Math.round((item.helpfulVotes / total) * 100);
	}

	onMount(() => {
		setTimeout(() => {
			animationTriggered = true;
		}, 100);
	});
</script>

<svelte:head>
	<title>Support Center - Get Help & Find Answers</title>
	<meta name="description" content="Find answers to common questions, contact our support team, and get the help you need." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">

	<!-- Hero Section -->
	<section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-24">
		<!-- Animated Background -->
		<div class="absolute inset-0 opacity-30">
			<div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
			<div class="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
		</div>

		<!-- Floating Particles -->
		<div class="absolute inset-0 overflow-hidden">
			{#each Array(10) as _, i}
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

		<div class="relative z-10 w-screen mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center space-y-8">
				<BadgeComponent
					text="We're Here to Help"
					icon={Headphones}
					variant="transparent"
					position="center"
				/>

				<div class="space-y-6 animate-fade-in-up">
					<h1 class="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
						<span class="text-white drop-shadow-2xl">Support</span>
						<span class="text-white"> </span>
						<span class="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
							Center
						</span>
					</h1>
					<p class="text-xl lg:text-2xl text-blue-100 font-light max-w-3xl mx-auto">
						Find answers instantly or connect with our support team
					</p>
				</div>

				<!-- Search Bar -->
				<div class="max-w-2xl mx-auto animate-fade-in-up" style="animation-delay: 0.2s">
					<div class="relative">
						<Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Search for answers... (e.g., 'How do I reset my password?')"
							class="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
	<section class="py-16 px-4 sm:px-6 lg:px-8">
		<div class="max-w-7xl mx-auto">

			<!-- Category Filter Tabs -->
			<div class="flex flex-wrap justify-center gap-3 mb-12">
				<button
					onclick={() => selectedCategory = null}
					class="px-6 py-3 rounded-xl font-semibold transition-all duration-300 {selectedCategory === null 
						? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
						: 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400'}"
				>
					All Topics
				</button>
				{#each faqCategories as category}
					<button
						onclick={() => selectedCategory = category.id}
						class="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 {selectedCategory === category.id 
							? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg' 
							: 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400'}"
					>
						<svelte:component this={category.icon} class="w-4 h-4" />
						{category.name}
					</button>
				{/each}
			</div>

			<!-- FAQ Items -->
			<div class="space-y-8">
				{#each filteredCategories() as category}
					<div class="animate-fade-in">
						<!-- Category Header -->
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-xl bg-gradient-to-br {category.color} flex items-center justify-center">
								<svelte:component this={category.icon} class="w-5 h-5 text-white" />
							</div>
							<h3 class="text-2xl font-bold text-gray-900 dark:text-white">
								{category.name}
							</h3>
							<span class="ml-auto text-sm text-gray-500 dark:text-gray-400">
								{category.faqs.length} {category.faqs.length === 1 ? 'question' : 'questions'}
							</span>
						</div>

						<!-- FAQ Items -->
						<div class="space-y-4">
							{#each category.faqs as item}
								<div class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300">
									<!-- Question Header -->
									<button
										onclick={() => toggleItem(item.uuid)}
										class="w-full px-6 py-5 flex items-start gap-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
									>
										<div class="flex-1">
											<h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
												{item.question}
											</h4>
											<div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
												<div class="flex items-center gap-1">
													<ThumbsUp class="w-4 h-4" />
													<span>{item.helpfulVotes}</span>
												</div>
												<div class="flex items-center gap-1">
													<ThumbsDown class="w-4 h-4" />
													<span>{item.notHelpfulVotes}</span>
												</div>
												<div class="flex items-center gap-1">
													<span class="text-xs font-medium text-green-600 dark:text-green-400">
														{getHelpfulnessPercentage(item)}% found this helpful
													</span>
												</div>
											</div>
										</div>
										<ChevronDown
											class="w-5 h-5 text-gray-400 transition-transform duration-300 {expandedItems.has(item.id) ? 'rotate-180' : ''}"
										/>
									</button>

									<!-- Answer Content -->
									{#if expandedItems.has(item.uuid)}
										<div class="px-6 pb-6 animate-slide-down">
											<div class="pt-4 border-t border-gray-100 dark:border-slate-700">
												<p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
													{item.answer}
												</p>

												<!-- Voting Section -->
												<div class="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-4">
													<div class="flex items-center justify-between">
														<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
															Was this helpful?
														</span>
														<div class="flex items-center gap-3">
															<button
																onclick={() => handleVote(item.uuid, 'up')}
																class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
    {userVotes.get(item.uuid) === 'up'
        ? 'bg-green-500 text-white shadow-lg scale-105'
        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-slate-600'}"
															>
																<ThumbsUp class="w-4 h-4" />
																<span class="text-sm">Yes</span>
															</button>

															<button
																onclick={() => handleVote(item.uuid, 'down')}
																class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
    {userVotes.get(item.uuid) === 'down'
        ? 'bg-red-500 text-white shadow-lg scale-105'
        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-slate-600'}"
															>
																<ThumbsDown class="w-4 h-4" />
																<span class="text-sm">No</span>
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/each}

				<!-- No Results Message -->
				{#if filteredCategories().length === 0}
					<div class="text-center py-16">
						<div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
							<Search class="w-10 h-10 text-gray-400" />
						</div>
						<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
							No results found
						</h3>
						<p class="text-gray-600 dark:text-gray-400 mb-6">
							We couldn't find any FAQs matching "{searchQuery}"
						</p>
						<button
							onclick={() => { searchQuery = ''; selectedCategory = null; }}
							class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
						>
							Clear Search
						</button>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Quick Links Section -->
	<section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800/50">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
					Additional Resources
				</h2>
				<p class="text-gray-600 dark:text-gray-400">
					Explore more ways to get help and learn about our platform
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each quickLinks as link, i}
					<a
					href={link.href}
					class="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-slide-in"
					style="animation-delay: {i * 0.1}s"
					>
					<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
						<svelte:component this={link.icon} class="w-6 h-6 text-white" />
					</div>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
						{link.text}
						<ExternalLink class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
					</h3>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Still Need Help CTA -->
	<section class="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
		<div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600"></div>
		<div class="absolute inset-0 opacity-50">
			<div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
		</div>

		<div class="relative z-10 max-w-4xl mx-auto text-center">
			<CheckCircle2 class="w-16 h-16 text-white mx-auto mb-6 animate-bounce" />
			<h2 class="text-4xl font-bold text-white mb-4">
				Still Need Help?
			</h2>
			<p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
				Can't find what you're looking for? Our support team is ready to assist you with any questions or issues.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<button class="group px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-2xl">
					<span class="flex items-center gap-2">
						<MessageSquare class="w-5 h-5" />
						Start Live Chat
						<Zap class="w-4 h-4 group-hover:rotate-12 transition-transform" />
					</span>
				</button>
				<button class="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105">
					<span class="flex items-center gap-2">
						<Mail class="w-5 h-5" />
						Email Us
					</span>
				</button>
			</div>
		</div>
	</section>
</div>

<style>
    @keyframes gradient-x {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }

    @keyframes float-particle {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }

    @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-in {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-down {
        from { opacity: 0; max-height: 0; }
        to { opacity: 1; max-height: 500px; }
    }

    .animate-gradient-x {
        background-size: 200% 200%;
        animation: gradient-x 3s ease infinite;
    }

    .animate-float-particle { animation: float-particle linear infinite; }
    .animate-fade-in { animation: fade-in 1s ease-out forwards; opacity: 0; }
    .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; opacity: 0; }
    .animate-slide-in { animation: slide-in 0.8s ease-out forwards; opacity: 0; }
    .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
</style>