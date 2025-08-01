// src/lib/stores/faqCategoryAdminStore.ts

import { writable, derived } from 'svelte/store';
import {
	FAQCategoryAdminAPIService,
	type CreateFAQCategoryRequest,
	type UpdateFAQCategoryRequest
} from '$lib/api/faqCategoryAdminAPI';
import type { FAQCategory } from '$lib/types/faq';

/**
 * Admin FAQ Category Store State Interface
 */
interface FAQCategoryAdminState {
	categories: FAQCategory[];
	selectedCategory: FAQCategory | null;
	loading: boolean;
	error: string | null;
	isFormOpen: boolean;
	formMode: 'create' | 'edit';
	analytics: {
		totalCategories: number;
		activeCategories: number;
		categoriesWithFAQs: number;
		averageFAQsPerCategory: number;
		topCategories: FAQCategory[];
	};
}

/**
 * Initial state
 */
const initialState: FAQCategoryAdminState = {
	categories: [],
	selectedCategory: null,
	loading: false,
	error: null,
	isFormOpen: false,
	formMode: 'create',
	analytics: {
		totalCategories: 0,
		activeCategories: 0,
		categoriesWithFAQs: 0,
		averageFAQsPerCategory: 0,
		topCategories: []
	}
};

/**
 * Create the FAQ Category Admin Store
 */
function createFAQCategoryAdminStore() {
	const { subscribe, set, update } = writable<FAQCategoryAdminState>(initialState);

	return {
		subscribe,

		/**
		 * Load all FAQ categories for admin management
		 */
		async loadCategories() {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const categories = await FAQCategoryAdminAPIService.getAllCategoriesForAdmin();
				update(state => ({
					...state,
					categories: categories.sort((a, b) => a.displayOrder - b.displayOrder),
					loading: false
				}));
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to load categories';
				update(state => ({ ...state, error: errorMessage, loading: false }));
				console.error('Failed to load FAQ categories:', error);
			}
		},

		/**
		 * Load a specific category for editing
		 */
		async loadCategory(id: number) {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const category = await FAQCategoryAdminAPIService.getFAQCategoryById(id);
				update(state => ({
					...state,
					selectedCategory: category,
					loading: false
				}));
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to load category';
				update(state => ({ ...state, error: errorMessage, loading: false }));
				console.error('Failed to load FAQ category:', error);
			}
		},

		/**
		 * Create a new FAQ category
		 */
		async createCategory(categoryData: CreateFAQCategoryRequest) {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const newCategory = await FAQCategoryAdminAPIService.createFAQCategory(categoryData);
				update(state => ({
					...state,
					categories: [...state.categories, newCategory].sort((a, b) => a.displayOrder - b.displayOrder),
					loading: false,
					isFormOpen: false,
					selectedCategory: null
				}));
				return newCategory;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to create category';
				update(state => ({ ...state, error: errorMessage, loading: false }));
				console.error('Failed to create FAQ category:', error);
				throw error;
			}
		},

		/**
		 * Update an existing FAQ category
		 */
		async updateCategory(id: number, categoryData: UpdateFAQCategoryRequest) {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const updatedCategory = await FAQCategoryAdminAPIService.updateFAQCategory(id, categoryData);
				update(state => ({
					...state,
					categories: state.categories.map(cat =>
						cat.id === id ? updatedCategory : cat
					).sort((a, b) => a.displayOrder - b.displayOrder),
					loading: false,
					isFormOpen: false,
					selectedCategory: null
				}));
				return updatedCategory;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to update category';
				update(state => ({ ...state, error: errorMessage, loading: false }));
				console.error('Failed to update FAQ category:', error);
				throw error;
			}
		},

		/**
		 * Delete an FAQ category
		 */
		async deleteCategory(id: number) {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				await FAQCategoryAdminAPIService.deleteFAQCategory(id);
				update(state => ({
					...state,
					categories: state.categories.filter(cat => cat.id !== id),
					selectedCategory: state.selectedCategory?.id === id ? null : state.selectedCategory,
					loading: false
				}));
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
				update(state => ({ ...state, error: errorMessage, loading: false }));
				console.error('Failed to delete FAQ category:', error);
				throw error;
			}
		},

		/**
		 * Toggle category active status
		 */
		async toggleCategoryStatus(id: number, isActive: boolean) {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const updatedCategory = await FAQCategoryAdminAPIService.toggleCategoryStatus(id, isActive);
				update(state => ({
					...state,
					categories: state.categories.map(cat =>
						cat.id === id ? updatedCategory : cat
					),
					loading: false
				}));
				return updatedCategory;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to update category status';
				update(state => ({ ...state, error: errorMessage, loading: false }));
				console.error('Failed to toggle category status:', error);
				throw error;
			}
		},

		/**
		 * Load analytics data
		 */
		async loadAnalytics() {
			try {
				const analytics = await FAQCategoryAdminAPIService.getCategoryAnalytics();
				update(state => ({ ...state, analytics }));
			} catch (error) {
				console.error('Failed to load analytics:', error);
			}
		},

		/**
		 * Validate slug uniqueness
		 */
		async validateSlug(slug: string, excludeId?: number) {
			try {
				return await FAQCategoryAdminAPIService.validateSlug(slug, excludeId);
			} catch (error) {
				console.error('Failed to validate slug:', error);
				return { isValid: false };
			}
		},

		/**
		 * Generate slug from name
		 */
		async generateSlug(name: string) {
			try {
				const result = await FAQCategoryAdminAPIService.generateSlug(name);
				return result.slug;
			} catch (error) {
				console.error('Failed to generate slug:', error);
				return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
			}
		},

		// UI State Management
		/**
		 * Open form for creating new category
		 */
		openCreateForm() {
			update(state => ({
				...state,
				selectedCategory: null,
				formMode: 'create',
				isFormOpen: true,
				error: null
			}));
		},

		/**
		 * Open form for editing existing category
		 */
		openEditForm(category: FAQCategory) {
			update(state => ({
				...state,
				selectedCategory: { ...category },
				formMode: 'edit',
				isFormOpen: true,
				error: null
			}));
		},

		/**
		 * Close form and clear state
		 */
		closeForm() {
			update(state => ({
				...state,
				isFormOpen: false,
				selectedCategory: null,
				error: null
			}));
		},

		/**
		 * Clear error state
		 */
		clearError() {
			update(state => ({ ...state, error: null }));
		},

		/**
		 * Reload all data
		 */
		async reloadData() {
			await Promise.all([
				this.loadCategories(),
				this.loadAnalytics()
			]);
		},

		/**
		 * Set categories (for initial data loading)
		 */
		setCategories(categories: FAQCategory[]) {
			update(state => ({
				...state,
				categories: categories.sort((a, b) => a.displayOrder - b.displayOrder)
			}));
		}
	};
}

/**
 * Create derived stores for computed values
 */
export const faqCategoryAdminStore = createFAQCategoryAdminStore();

// Derived stores for computed properties
export const activeCategories = derived(
	faqCategoryAdminStore,
	$store => $store.categories.filter(cat => cat.isActive)
);

export const inactiveCategories = derived(
	faqCategoryAdminStore,
	$store => $store.categories.filter(cat => !cat.isActive)
);

export const categoriesByFAQCount = derived(
	faqCategoryAdminStore,
	$store => [...$store.categories].sort((a, b) => (b.faqCount || 0) - (a.faqCount || 0))
);

export const isCreateMode = derived(
	faqCategoryAdminStore,
	$store => $store.formMode === 'create'
);

export const isEditMode = derived(
	faqCategoryAdminStore,
	$store => $store.formMode === 'edit'
);

export const nextDisplayOrder = derived(
	faqCategoryAdminStore,
	$store => {
		const maxOrder = Math.max(...$store.categories.map(cat => cat.displayOrder), -1);
		return maxOrder + 1;
	}
);