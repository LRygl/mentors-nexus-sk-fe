import { writable, derived, type Readable, type Writable } from 'svelte/store';
import type { FAQItem, FAQCategory, FAQFilters } from '$lib/types/faq.js';
import { HelpCircle, User, BookOpen, CreditCard, Settings, Shield } from 'lucide-svelte';

// Icon mapping
const iconMap = {
	HelpCircle,
	User,
	BookOpen,
	CreditCard,
	Settings,
	Shield
};

// Internal data stores
const _faqData = writable<FAQItem[]>([]);
const _categoryStructure = writable<Omit<FAQCategory, 'count'>[]>([]);
const _popularSearches = writable<string[]>([]);

// User interaction stores
export const searchQuery = writable('');
export const selectedCategory = writable('all');
export const expandedItems = writable<Set<string>>(new Set());

// Derived stores
export const filteredFAQs = derived(
	[_faqData, searchQuery, selectedCategory],
	([$faqData, $searchQuery, $selectedCategory]) => {
		return $faqData.filter(faq => {
			const matchesCategory = $selectedCategory === 'all' || faq.category === $selectedCategory;
			const matchesSearch = $searchQuery === '' ||
				faq.question.toLowerCase().includes($searchQuery.toLowerCase()) ||
				faq.answer.toLowerCase().includes($searchQuery.toLowerCase()) ||
				faq.tags.some(tag => tag.toLowerCase().includes($searchQuery.toLowerCase()));

			return matchesCategory && matchesSearch;
		});
	}
);

export const categories = derived(
	[_categoryStructure, filteredFAQs],
	([$categoryStructure, $filteredFAQs]) => {
		return $categoryStructure.map(cat => ({
			...cat,
			count: cat.id === 'all'
				? $filteredFAQs.length
				: $filteredFAQs.filter(faq => faq.category === cat.id).length
		}));
	}
);

export const showClearButton = derived(
	[searchQuery, selectedCategory],
	([$searchQuery, $selectedCategory]) => {
		return $searchQuery !== '' || $selectedCategory !== 'all';
	}
);

export const popularSearches = derived(
	_popularSearches,
	($popularSearches) => $popularSearches
);

// Actions (functions to update stores)
export const faqActions = {
	// Load data from JSON
	loadData: (faqData: any) => {
		_faqData.set(faqData.faqs);
		_popularSearches.set(faqData.popularSearches);
		_categoryStructure.set(faqData.categories.map((cat: any) => ({
			id: cat.id,
			label: cat.label,
			icon: iconMap[cat.iconName as keyof typeof iconMap]
		})));
	},

	// Search actions
	setSearchQuery: (query: string) => {
		searchQuery.set(query);
	},

	// Category actions
	setSelectedCategory: (categoryId: string) => {
		selectedCategory.set(categoryId);
	},

	// Expanded items actions
	toggleExpanded: (id: string) => {
		expandedItems.update(items => {
			const newSet = new Set(items);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	},

	// Clear filters
	clearFilters: () => {
		searchQuery.set('');
		selectedCategory.set('all');
	}
};
