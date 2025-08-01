// src/lib/stores/faqCategoryAdminStore.ts (updated with shared types)
import { writable, derived } from 'svelte/store';
import {
	FAQCategoryAdminAPIService,
	type CategoryQueryParams,
	type CreateFAQCategoryRequest,
	type UpdateFAQCategoryRequest,
	type CategoryAnalyticsResponse
} from '$lib/api/faqCategoryAdminAPI';
import type { FAQCategory } from '$lib/types/faq';
import type { PaginationInfo } from '$lib/types/pagination';
import { extractPaginationInfo } from '$lib/types/pagination';
import { getErrorMessage, logError, handleApiError } from '$lib/utils/errorUtils';

type FormMode = 'create' | 'edit';

interface StoreState {
	categories: FAQCategory[];
	selectedCategory: FAQCategory | null;
	loading: boolean;
	error: string | null;
	formMode: FormMode;
	analytics: CategoryAnalyticsResponse;
	slugValidation: {
		isValid: boolean;
		isChecking: boolean;
		suggestion?: string;
	};
	// Optional pagination info (for when using paginated endpoints)
	pagination?: PaginationInfo;
}

const initialAnalytics: CategoryAnalyticsResponse = {
	totalCategories: 0,
	activeCategories: 0,
	categoriesWithFAQs: 0,
	averageFAQsPerCategory: 0,
	topCategories: []
};

const initialState: StoreState = {
	categories: [],
	selectedCategory: null,
	loading: false,
	error: null,
	formMode: 'create',
	analytics: initialAnalytics,
	slugValidation: {
		isValid: true,
		isChecking: false
	}
};

function createFAQCategoryAdminStore() {
	const { subscribe, set, update } = writable<StoreState>(initialState);

	return {
		subscribe,

		/**
		 * Load all categories from API (simple version - gets all categories)
		 * Good for most admin interfaces where you want to show all categories
		 */
		async loadCategories(queryParams: CategoryQueryParams = {}) {
			console.log('🔄 Loading all FAQ categories...', queryParams);
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const categories = await FAQCategoryAdminAPIService.getAllCategoriesForAdmin(queryParams);
				console.log('✅ Loaded categories:', categories.length);

				update(state => ({
					...state,
					categories,
					loading: false,
					// Update basic analytics from loaded data
					analytics: {
						...state.analytics,
						totalCategories: categories.length,
						activeCategories: categories.filter(c => c.isActive).length
					}
				}));
			} catch (error) {
				logError('Load FAQ categories', error);
				const errorMessage = handleApiError(error, 'load categories');
				update(state => ({
					...state,
					error: errorMessage,
					loading: false,
					categories: [] // Clear any stale data
				}));
			}
		},

		/**
		 * Load paginated categories (when you need pagination controls)
		 * Good for data tables with large datasets
		 */
		async loadPaginatedCategories(queryParams: CategoryQueryParams = {}) {
			console.log('🔄 Loading paginated FAQ categories...', queryParams);
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const pageResponse = await FAQCategoryAdminAPIService.getPaginatedCategories(queryParams);
				const paginationInfo = extractPaginationInfo(pageResponse);

				console.log('✅ Loaded paginated categories:', {
					content: pageResponse.content.length,
					pagination: paginationInfo
				});

				update(state => ({
					...state,
					categories: pageResponse.content,
					pagination: paginationInfo,
					loading: false,
					analytics: {
						...state.analytics,
						totalCategories: paginationInfo.totalElements,
						activeCategories: pageResponse.content.filter(c => c.isActive).length
					}
				}));
			} catch (error) {
				logError('Load paginated FAQ categories', error);
				const errorMessage = handleApiError(error, 'load categories');
				update(state => ({
					...state,
					error: errorMessage,
					loading: false,
					categories: []
				}));
			}
		},

		/**
		 * Load a specific category by ID
		 */
		async loadCategory(id: number) {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const selectedCategory = await FAQCategoryAdminAPIService.getFAQCategoryById(id);
				console.log('✅ Loaded category:', selectedCategory);

				update(state => ({
					...state,
					selectedCategory,
					loading: false
				}));

				return selectedCategory;
			} catch (error) {
				console.error('❌ Failed to load FAQ category:', error);
				const errorMessage = error instanceof Error ? error.message : 'Failed to load category';
				update(state => ({
					...state,
					error: errorMessage,
					loading: false
				}));
				throw error;
			}
		},

		/**
		 * Create a new category
		 */
		async createCategory(categoryData: CreateFAQCategoryRequest) {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const newCategory = await FAQCategoryAdminAPIService.createFAQCategory(categoryData);
				console.log('✅ Created category:', newCategory);

				update(state => ({
					...state,
					categories: [...state.categories, newCategory],
					loading: false
				}));

				return newCategory;
			} catch (error) {
				console.error('❌ Failed to create category:', error);
				const errorMessage = error instanceof Error ? error.message : 'Failed to create category';
				update(state => ({
					...state,
					error: errorMessage,
					loading: false
				}));
				throw error;
			}
		},

		/**
		 * Update an existing category
		 */
		async updateCategory(id: number, categoryData: UpdateFAQCategoryRequest) {
			update(state => ({ ...state, loading: true, error: null }));

			try {
				const updatedCategory = await FAQCategoryAdminAPIService.updateFAQCategory(id, categoryData);
				console.log('✅ Updated category:', updatedCategory);

				update(state => {
					const index = state.categories.findIndex(cat => cat.id === id);
					const categories = [...state.categories];
					if (index !== -1) {
						categories[index] = updatedCategory;
					}

					return {
						...state,
						categories,
						selectedCategory: updatedCategory,
						loading: false
					};
				});

				return updatedCategory;
			} catch (error) {
				console.error('❌ Failed to update category:', error);
				const errorMessage = error instanceof Error ? error.message : 'Failed to update category';
				update(state => ({
					...state,
					error: errorMessage,
					loading: false
				}));
				throw error;
			}
		},

		/**
		 * Toggle category active status
		 */
		async toggleCategoryStatus(id: number, isActive: boolean) {
			try {
				const updatedCategory = await FAQCategoryAdminAPIService.toggleCategoryStatus(id, isActive);
				console.log('✅ Toggled category status:', updatedCategory);

				update(state => {
					const categoryIndex = state.categories.findIndex(cat => cat.id === id);
					const categories = [...state.categories];
					if (categoryIndex !== -1) {
						categories[categoryIndex] = updatedCategory;
					}

					return { ...state, categories };
				});

				return updatedCategory;
			} catch (error) {
				console.error('❌ Failed to toggle category status:', error);
				const errorMessage = error instanceof Error ? error.message : 'Failed to toggle category status';
				update(state => ({ ...state, error: errorMessage }));
				throw error;
			}
		},

		/**
		 * Delete a category
		 */
		async deleteCategory(id: number) {
			try {
				await FAQCategoryAdminAPIService.deleteFAQCategory(id);
				console.log('✅ Deleted category:', id);

				update(state => ({
					...state,
					categories: state.categories.filter(cat => cat.id !== id)
				}));
			} catch (error) {
				console.error('❌ Failed to delete category:', error);
				const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
				update(state => ({ ...state, error: errorMessage }));
				throw error;
			}
		},

		/**
		 * Load analytics data
		 */
		async loadAnalytics() {
			try {
				const analytics = await FAQCategoryAdminAPIService.getCategoryAnalytics();
				console.log('✅ Loaded analytics:', analytics);

				update(state => ({ ...state, analytics }));
				return analytics;
			} catch (error) {
				console.error('❌ Failed to load analytics:', error);
				throw error;
			}
		},

		/**
		 * Validate slug uniqueness
		 */
		async validateSlug(slug: string, excludeId?: number) {
			update(state => ({
				...state,
				slugValidation: { ...state.slugValidation, isChecking: true }
			}));

			try {
				const result = await FAQCategoryAdminAPIService.validateSlug(slug, excludeId);
				update(state => ({
					...state,
					slugValidation: {
						isValid: result.isValid,
						isChecking: false,
						suggestion: result.suggestion
					}
				}));
				return result;
			} catch (error) {
				update(state => ({
					...state,
					slugValidation: {
						isValid: false,
						isChecking: false
					}
				}));
				console.error('Failed to validate slug:', error);
				throw error;
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
				// Fallback to simple slug generation
				return name.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/^-+|-+$/g, '');
			}
		},

		/**
		 * Form management methods
		 */
		openCreateForm() {
			update(state => ({
				...state,
				formMode: 'create' as FormMode,
				selectedCategory: null,
				error: null,
				slugValidation: { isValid: true, isChecking: false }
			}));
		},

		openEditForm(category: FAQCategory) {
			update(state => ({
				...state,
				formMode: 'edit' as FormMode,
				selectedCategory: { ...category },
				error: null,
				slugValidation: { isValid: true, isChecking: false }
			}));
		},

		closeForm() {
			update(state => ({
				...state,
				formMode: 'create' as FormMode,
				selectedCategory: null,
				error: null,
				slugValidation: { isValid: true, isChecking: false }
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
			await this.loadCategories();
		}
	};
}

export const faqCategoryAdminStore = createFAQCategoryAdminStore();

// Derived stores for computed values
export const filteredCategories = derived(
	faqCategoryAdminStore,
	$store => {
		console.log('🔍 Categories available:', $store.categories.length);
		return $store.categories;
	}
);