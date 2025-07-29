<!-- Support Public Page  -->

<script lang="ts">
	import { HelpCircle, User, BookOpen, CreditCard, Settings, Shield } from 'lucide-svelte';
	import HeaderSection from '$lib/components/Sections/header-section.svelte';
	import SearchBar from '$lib/components/FAQ/SearchBar.svelte';
	import CategoryFilter from '$lib/components/FAQ/CategoryFilter.svelte';
	import FAQCard from '$lib/components/FAQ/FAQCard.svelte';
	import EmptyState from '$lib/components/FAQ/EmptyState.svelte';
	import SupportSection from '$lib/components/FAQ/SupportSection.svelte';
	import StatsSection from '$lib/components/FAQ/StatsSection.svelte';
	import type { FAQItem, FAQCategory } from '$lib/types/faq.js';

	// State management
	let searchQuery = $state('');
	let selectedCategory = $state('all');
	let expandedItems = $state<Set<string>>(new Set());

	// Categories configuration
	const categories: FAQCategory[] = [
		{ id: 'all', label: 'All Categories', icon: HelpCircle, count: 0 },
		{ id: 'getting-started', label: 'Getting Started', icon: User, count: 0 },
		{ id: 'courses', label: 'Courses & Learning', icon: BookOpen, count: 0 },
		{ id: 'billing', label: 'Billing & Payments', icon: CreditCard, count: 0 },
		{ id: 'technical', label: 'Technical Support', icon: Settings, count: 0 },
		{ id: 'account', label: 'Account & Privacy', icon: Shield, count: 0 }
	];

	// FAQ data - moved to external file in real implementation
	const faqData: FAQItem[] = [
		{
			id: 'gs-1',
			category: 'getting-started',
			question: 'How do I create an account on the LMS platform?',
			answer: 'Creating an account is simple! Click the "Sign Up" button on our homepage, fill in your basic information including name, email, and password. You\'ll receive a verification email to activate your account. Once verified, you can immediately start exploring our course catalog and enroll in courses.',
			tags: ['signup', 'registration', 'account', 'verification']
		},
		// ... (rest of FAQ data - truncated for brevity)
	];

	const popularSearches = [
		'certificates', 'payment', 'video issues', 'account', 'enrollment', 'refund'
	];

	// Calculate category counts
	$effect(() => {
		categories.forEach(category => {
			if (category.id === 'all') {
				category.count = faqData.length;
			} else {
				category.count = faqData.filter(faq => faq.category === category.id).length;
			}
		});
	});

	// Filter FAQs based on search and category
	const filteredFAQs = $derived(() => {
		return faqData.filter(faq => {
			const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
			const matchesSearch = searchQuery === '' ||
				faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
				faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
				faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

			return matchesCategory && matchesSearch;
		});
	});

	// Event handlers
	function handleSearchChange(query: string) {
		searchQuery = query;
	}

	function handlePopularSearchClick(search: string) {
		searchQuery = search;
	}

	function handleCategoryChange(categoryId: string) {
		selectedCategory = categoryId;
	}

	function handleToggleExpanded(id: string) {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
		} else {
			newExpanded.add(id);
		}
		expandedItems = newExpanded;
	}

	function handleClearFilters() {
		searchQuery = '';
		selectedCategory = 'all';
	}

	const showClearButton = $derived(() => searchQuery !== '' || selectedCategory !== 'all');
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
	<!-- Header Section -->
	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-gray-800 dark:text-gray-100">
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<HeaderSection
				heading="Frequently Asked Questions"
				subHeading="Find quick answers to common questions about our learning platform"
				showBadge={true}
				badgeText="Help Center"
			/>
		</div>
	</section>

	<!-- Main Content -->
	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

		<!-- Search Bar -->
		<div class="mb-12">
			<SearchBar
				bind:searchQuery
				{popularSearches}
				onSearchChange={handleSearchChange}
				onPopularSearchClick={handlePopularSearchClick}
			/>
		</div>

		<div class="grid lg:grid-cols-4 gap-8">
			<!-- Category Filter Sidebar -->
			<div class="lg:col-span-1">
				<CategoryFilter
					{categories}
					{selectedCategory}
					onCategoryChange={handleCategoryChange}
					onClearFilters={handleClearFilters}
					showClearButton={showClearButton}
				/>
			</div>

			<!-- FAQ Content -->
			<div class="lg:col-span-3">
				{#if filteredFAQs.length === 0}
					<EmptyState onClearFilters={handleClearFilters} />
				{:else}
					<div class="space-y-4">
						{#each filteredFAQs as faq}
							<FAQCard
								{faq}
								isExpanded={expandedItems.has(faq.id)}
								onToggle={handleToggleExpanded}
							/>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Support Section -->
		<div class="mt-16">
			<SupportSection />
		</div>

		<!-- Stats Section -->
		<div class="mt-12">
			<StatsSection />
		</div>
	</section>
</div>














<!--
<script lang="ts">
	import HeaderSection from '$lib/components/Sections/header-section.svelte';
	import FaqSection from '$lib/components/Sections/faq-section.svelte';
	import ContactSection from '$lib/components/Sections/contact-section.svelte';
	import QuickContactForm from '$lib/components/Forms/quick-contact-form.svelte';
</script>


<svelte:head>
	<title>Support • LMS</title>
</svelte:head>

<main>
	<section class="relative overflow-hidden">
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
			<HeaderSection
				heading="Support"
				subHeading="Need help? Find answers or get in touch with our team."
				showBadge={true}
				badgeText="24/7 assistance"
			/>
		</div>
	</section>

	<FaqSection />
	<ContactSection />
	<QuickContactForm />
</main>

-->