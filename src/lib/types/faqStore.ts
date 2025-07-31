// src/lib/stores/faq-store.ts
import { getPublishedFAQs, searchFAQs, getFAQsByCategorySlug, incrementFAQViewCount } from '$lib/api/faqAPI';
import { getVisibleFAQCategories } from '$lib/api/faqCategoryAPI';
import type { FAQ, FAQStatus, FAQPriority } from '$lib/types/faq';
import type { FAQCategory } from '$lib/types/faqCategory';

class FAQStore {
	// Core data
	faqs = $state<FAQ[]>([]);
	categories = $state<FAQCategory[]>([]);

	// UI state
	searchQuery = $state<string>('');
	selectedCategorySlug = $state<string>('all'); // Use slug for URL-friendly filtering
	expandedItems = $state<Set<string>>(new Set());
	loading = $state<boolean>(false);
	error = $state<string | null>(null);

	// Popular searches (you can customize these based on your analytics)
	popularSearches = $state<string[]>([
		'How to enroll',
		'Payment methods',
		'Certificate',
		'Refund policy',
		'Technical support'
	]);

	// Computed properties using getters
	get filteredFAQs(): FAQ[] {
		let filtered = this.faqs;

		// Only show published FAQs
		filtered = filtered.filter(faq => faq.isPublished);

		// Filter by category slug
		if (this.selectedCategorySlug !== 'all') {
			filtered = filtered.filter(faq =>
				faq.category.slug === this.selectedCategorySlug
			);
		}

		// Filter by search query
		if (this.searchQuery.trim()) {
			const query = this.searchQuery.toLowerCase();
			filtered = filtered.filter(faq =>
				faq.question.toLowerCase().includes(query) ||
				faq.answer.toLowerCase().includes(query) ||
				(faq.searchKeywords && faq.searchKeywords.toLowerCase().includes(query)) ||
				faq.category.name.toLowerCase().includes(query)
			);
		}

		// Sort by priority, then display order, then featured status
		return filtered.sort((a, b) => {
			// First by priority (HIGH > NORMAL > LOW)
			const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'NORMAL': 2, 'LOW': 1 };
			const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
			if (priorityDiff !== 0) return priorityDiff;

			// Then by featured status
			if (a.isFeatured !== b.isFeatured) {
				return b.isFeatured ? 1 : -1;
			}

			// Then by category display order
			const categoryOrderDiff = a.category.displayOrder - b.category.displayOrder;
			if (categoryOrderDiff !== 0) return categoryOrderDiff;

			// Finally by FAQ display order
			return a.displayOrder - b.displayOrder;
		});
	}

	get visibleCategories(): FAQCategory[] {
		return this.categories
			.filter(cat => cat.isVisible && cat.isActive)
			.sort((a, b) => a.displayOrder - b.displayOrder);
	}

	get featuredFAQs(): FAQ[] {
		return this.faqs
			.filter(faq => faq.isPublished && faq.isFeatured)
			.sort((a, b) => a.displayOrder - b.displayOrder);
	}

	get popularFAQs(): FAQ[] {
		return this.faqs
			.filter(faq => faq.isPublished && faq.isPopular)
			.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
	}

	get showClearButton(): boolean {
		return this.selectedCategorySlug !== 'all' || this.searchQuery.trim() !== '';
	}

	// Actions
	async loadFAQs() {
		this.loading = true;
		this.error = null;

		try {
			this.faqs = await getPublishedFAQs();
		} catch (error) {
			this.error = error instanceof Error ? error.message : 'Failed to load FAQs';
			console.error('Failed to load FAQs:', error);
		} finally {
			this.loading = false;
		}
	}

	async loadCategories() {
		try {
			this.categories = await getVisibleFAQCategories();
		} catch (error) {
			console.error('Failed to load FAQ categories:', error);
		}
	}

	async loadAllData() {
		await Promise.all([
			this.loadFAQs(),
			this.loadCategories()
		]);
	}

	async searchFAQsRemote(query: string) {
		if (!query.trim()) {
			this.setSearchQuery('');
			return;
		}

		this.loading = true;
		this.error = null;

		try {
			const results = await searchFAQs(query, true);
			this.faqs = results;
			this.setSearchQuery(query);
		} catch (error) {
			this.error = error instanceof Error ? error.message : 'Failed to search FAQs';
			console.error('Failed to search FAQs:', error);
		} finally {
			this.loading = false;
		}
	}

	async loadFAQsByCategory(categorySlug: string) {
		if (categorySlug === 'all') {
			await this.loadFAQs();
			return;
		}

		this.loading = true;
		this.error = null;

		try {
			const results = await getFAQsByCategorySlug(categorySlug, true);
			this.faqs = results;
		} catch (error) {
			this.error = error instanceof Error ? error.message : 'Failed to load category FAQs';
			console.error('Failed to load category FAQs:', error);
		} finally {
			this.loading = false;
		}
	}

	setSearchQuery(query: string) {
		this.searchQuery = query;
	}

	async setSelectedCategory(categorySlug: string) {
		this.selectedCategorySlug = categorySlug;
		// Optionally reload FAQs when category changes for server-side filtering
		// await this.loadFAQsByCategory(categorySlug);
	}

	toggleExpanded(id: string) {
		if (this.expandedItems.has(id)) {
			this.expandedItems.delete(id);
		} else {
			this.expandedItems.add(id);
		}
		// Trigger reactivity
		this.expandedItems = new Set(this.expandedItems);
	}

	clearFilters() {
		this.searchQuery = '';
		this.selectedCategorySlug = 'all';
	}

	expandAll() {
		this.expandedItems = new Set(this.filteredFAQs.map(faq => faq.id.toString()));
	}

	collapseAll() {
		this.expandedItems = new Set();
	}

	// Analytics actions
	async trackFAQView(faqId: number) {
		try {
			await incrementFAQViewCount(faqId);
		} catch (error) {
			// Fail silently for analytics
			console.warn('Failed to track FAQ view:', error);
		}
	}

	// Helper methods
	getFAQBySlug(slug: string): FAQ | undefined {
		return this.faqs.find(faq => faq.slug === slug);
	}

	getCategoryBySlug(slug: string): FAQCategory | undefined {
		return this.categories.find(cat => cat.slug === slug);
	}

	getFAQsByPriority(priority: FAQPriority): FAQ[] {
		return this.faqs.filter(faq => faq.priority === priority && faq.isPublished);
	}

	getFAQsByStatus(status: FAQStatus): FAQ[] {
		return this.faqs.filter(faq => faq.status === status);
	}
}

// Export store instance
export const faqStore = new FAQStore();

// Export reactive properties for easier component access
export const searchQuery = () => faqStore.searchQuery;
export const selectedCategorySlug = () => faqStore.selectedCategorySlug;
export const expandedItems = () => faqStore.expandedItems;
export const filteredFAQs = () => faqStore.filteredFAQs;
export const categories = () => faqStore.categories;
export const visibleCategories = () => faqStore.visibleCategories;
export const featuredFAQs = () => faqStore.featuredFAQs;
export const popularFAQs = () => faqStore.popularFAQs;
export const showClearButton = () => faqStore.showClearButton;
export const popularSearches = () => faqStore.popularSearches;
export const loading = () => faqStore.loading;
export const error = () => faqStore.error;

// Export actions
export const faqActions = {
	loadAllData: () => faqStore.loadAllData(),
	loadFAQs: () => faqStore.loadFAQs(),
	loadCategories: () => faqStore.loadCategories(),
	searchFAQsRemote: (query: string) => faqStore.searchFAQsRemote(query),
	loadFAQsByCategory: (categorySlug: string) => faqStore.loadFAQsByCategory(categorySlug),
	setSearchQuery: (query: string) => faqStore.setSearchQuery(query),
	setSelectedCategory: (categorySlug: string) => faqStore.setSelectedCategory(categorySlug),
	toggleExpanded: (id: string) => faqStore.toggleExpanded(id),
	clearFilters: () => faqStore.clearFilters(),
	expandAll: () => faqStore.expandAll(),
	collapseAll: () => faqStore.collapseAll(),
	trackFAQView: (faqId: number) => faqStore.trackFAQView(faqId),
	getFAQBySlug: (slug: string) => faqStore.getFAQBySlug(slug),
	getCategoryBySlug: (slug: string) => faqStore.getCategoryBySlug(slug),
	getFAQsByPriority: (priority: FAQPriority) => faqStore.getFAQsByPriority(priority),
	getFAQsByStatus: (status: FAQStatus) => faqStore.getFAQsByStatus(status)
};