// src/lib/stores/faq-store.ts

import { writable, derived, get } from 'svelte/store';
import type { FAQ, FAQCategory, FAQStoreState } from '$lib/types/faq';
import { FAQAPIService } from '$lib/api/faqAPI';
import { FAQCategoryAPIService } from '$lib/api/faqCategoryAPI';

// Create the main store state
function createFAQStore() {
	// Initial state
	const initialState: FAQStoreState = {
		// Data
		faqs: [],
		categories: [],
		featuredFAQs: [],
		popularFAQs: [],

		// UI State
		loading: false,
		error: null,
		searchQuery: '',
		selectedCategorySlug: 'all',
		expandedItems: new Set<string>(),

		// Computed - will be derived
		filteredFAQs: [],
		visibleCategories: [],
		showClearButton: false,
		popularSearches: ['Getting Started', 'Payments', 'Courses', 'Account', 'Technical Issues']
	};

	// Create writable store
	const { subscribe, set, update } = writable(initialState);

	// Derived stores for computed values
	const filteredFAQs = derived(
		{ subscribe },
		($state) => {
			let filtered = [...$state.faqs];

			// Filter by search query
			if ($state.searchQuery.trim()) {
				const query = $state.searchQuery.toLowerCase().trim();
				filtered = filtered.filter(faq =>
					faq.question.toLowerCase().includes(query) ||
					faq.answer.toLowerCase().includes(query) ||
					faq.searchKeywords?.toLowerCase().includes(query) ||
					faq.categoryName?.toLowerCase().includes(query)
				);
			}

			// Filter by category
			if ($state.selectedCategorySlug !== 'all') {
				filtered = filtered.filter(faq =>
					faq.categorySlug === $state.selectedCategorySlug
				);
			}

			// Sort by priority and display order
			filtered.sort((a, b) => {
				// First by priority (URGENT > HIGH > NORMAL > LOW)
				const priorityOrder = { URGENT: 4, HIGH: 3, NORMAL: 2, LOW: 1 };
				const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);

				if (priorityDiff !== 0) return priorityDiff;

				// Then by display order
				return a.displayOrder - b.displayOrder;
			});

			return filtered;
		}
	);

	const visibleCategories = derived(
		{ subscribe },
		($state) => {
			// Add "All Categories" option
			const allOption: FAQCategory = {
				id: 0,
				uuid: 'all',
				name: 'All Categories',
				slug: 'all',
				displayOrder: -1,
				isActive: true,
				isVisible: true,
				publishedFaqCount: $state.faqs.length,
				createdAt: '',
				updatedAt: ''
			};

			return [allOption, ...$state.categories.filter(cat => cat.isVisible)];
		}
	);

	const showClearButton = derived(
		{ subscribe },
		($state) => {
			return $state.searchQuery.trim() !== '' || $state.selectedCategorySlug !== 'all';
		}
	);

	// Actions
	const actions = {
		// Data loading actions
		async loadAllData() {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const [faqs, categories, featuredFAQs, popularFAQs] = await Promise.all([
					FAQAPIService.getAllPublishedFAQs(),
					FAQCategoryAPIService.getCategoriesWithFAQCounts(),
					FAQAPIService.getFeaturedFAQs(),
					FAQAPIService.getPopularFAQs(10)
				]);

				update(state => ({
					...state,
					faqs,
					categories,
					featuredFAQs,
					popularFAQs,
					loading: false,
					error: null
				}));
			} catch (error) {
				console.error('Failed to load FAQ data:', error);
				update(state => ({
					...state,
					loading: false,
					error: error instanceof Error ? error.message : 'Failed to load FAQ data'
				}));
			}
		},

		async loadFAQsByCategory(categorySlug: string) {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const faqs = await FAQAPIService.getFAQsByCategorySlug(categorySlug);
				update(state => ({
					...state,
					faqs,
					loading: false,
					error: null
				}));
			} catch (error) {
				console.error('Failed to load FAQs by category:', error);
				update(state => ({
					...state,
					loading: false,
					error: error instanceof Error ? error.message : 'Failed to load FAQs'
				}));
			}
		},

		async searchFAQs(query: string, category?: string) {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const faqs = await FAQAPIService.searchFAQs({ q: query, category });
				update(state => ({
					...state,
					faqs,
					loading: false,
					error: null
				}));
			} catch (error) {
				console.error('Failed to search FAQs:', error);
				update(state => ({
					...state,
					loading: false,
					error: error instanceof Error ? error.message : 'Failed to search FAQs'
				}));
			}
		},

		// UI state actions
		setSearchQuery(query: string) {
			update(state => ({ ...state, searchQuery: query }));
		},

		setSelectedCategory(categorySlug: string) {
			update(state => ({ ...state, selectedCategorySlug: categorySlug }));
		},

		toggleExpanded(id: string) {
			update(state => {
				const newExpanded = new Set(state.expandedItems);
				if (newExpanded.has(id)) {
					newExpanded.delete(id);
				} else {
					newExpanded.add(id);
				}
				return { ...state, expandedItems: newExpanded };
			});
		},

		expandAll() {
			update(state => {
				const currentState = get({ subscribe });
				const allIds = new Set(get(filteredFAQs).map(faq => faq.id.toString()));
				return { ...state, expandedItems: allIds };
			});
		},

		collapseAll() {
			update(state => ({ ...state, expandedItems: new Set() }));
		},

		clearFilters() {
			update(state => ({
				...state,
				searchQuery: '',
				selectedCategorySlug: 'all',
				expandedItems: new Set()
			}));
		},

		// FAQ interaction actions
		async voteFAQHelpful(uuid: string, helpful: boolean) {
			try {
				await FAQAPIService.voteFAQHelpfulness(uuid, helpful);

				// Update the FAQ in our store
				update(state => ({
					...state,
					faqs: state.faqs.map(faq =>
						faq.uuid === uuid
							? {
								...faq,
								helpfulVotes: helpful ? faq.helpfulVotes + 1 : faq.helpfulVotes,
								notHelpfulVotes: !helpful ? faq.notHelpfulVotes + 1 : faq.notHelpfulVotes
							}
							: faq
					)
				}));
			} catch (error) {
				console.error('Failed to vote on FAQ:', error);
				// Could show a toast notification here
			}
		},

		// Utility actions
		getFAQByUuid(uuid: string): FAQ | undefined {
			const state = get({ subscribe });
			return state.faqs.find(faq => faq.uuid === uuid);
		},

		getCategoryBySlug(slug: string): FAQCategory | undefined {
			const state = get({ subscribe });
			return state.categories.find(cat => cat.slug === slug);
		}
	};

	return {
		subscribe,
		set,
		update,
		actions,
		// Derived stores
		filteredFAQs,
		visibleCategories,
		showClearButton
	};
}

// Export the store and actions
export const faqStore = createFAQStore();
export const faqActions = faqStore.actions;

// Export derived stores for easy access
export const filteredFAQs = faqStore.filteredFAQs;
export const visibleCategories = faqStore.visibleCategories;
export const showClearButton = faqStore.showClearButton;