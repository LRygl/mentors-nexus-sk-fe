// lib/stores/course-filter-store.ts
import { writable, derived } from 'svelte/store';
import type { Course } from '$lib/types/course';
import type {
	CourseFilters,
	CourseDisplaySettings,
	SortOption,
	Difficulty
} from '$lib/types/course-filters';

// Initial filter state
const initialFilters: CourseFilters = {
	searchQuery: '',
	selectedCategories: [],
	priceRange: { min: 0, max: 500 },
	selectedDifficulty: [],
	selectedDuration: [],
	selectedRating: 0,
	showFreeOnly: false,
	sortBy: 'popular'
};

// Initial display settings
const initialDisplaySettings: CourseDisplaySettings = {
	viewMode: 'grid',
	currentPage: 1,
	coursesPerPage: 12,
	showFilters: false
};

function createCourseFilterStore() {
	const filters = writable<CourseFilters>(initialFilters);
	const displaySettings = writable<CourseDisplaySettings>(initialDisplaySettings);

	return {
		filters: {
			subscribe: filters.subscribe,
			update: filters.update,
			set: filters.set,
			reset: () => {
				filters.set(initialFilters);
				displaySettings.update(s => ({ ...s, currentPage: 1 }));
			}
		},

		displaySettings: {
			subscribe: displaySettings.subscribe,
			update: displaySettings.update,
			set: displaySettings.set
		},

		// Action methods
		updateSearchQuery: (query: string) => {
			filters.update(f => ({ ...f, searchQuery: query }));
			displaySettings.update(s => ({ ...s, currentPage: 1 }));
		},

		updateSort: (sortBy: SortOption) => {
			filters.update(f => ({ ...f, sortBy }));
			displaySettings.update(s => ({ ...s, currentPage: 1 }));
		},

		toggleCategory: (category: string) => {
			filters.update(f => ({
				...f,
				selectedCategories: f.selectedCategories.includes(category)
					? f.selectedCategories.filter(c => c !== category)
					: [...f.selectedCategories, category]
			}));
			displaySettings.update(s => ({ ...s, currentPage: 1 }));
		},

		toggleDifficulty: (difficulty: Difficulty) => {
			filters.update(f => ({
				...f,
				selectedDifficulty: f.selectedDifficulty.includes(difficulty)
					? f.selectedDifficulty.filter(d => d !== difficulty)
					: [...f.selectedDifficulty, difficulty]
			}));
			displaySettings.update(s => ({ ...s, currentPage: 1 }));
		},

		updatePriceRange: (type: 'min' | 'max', value: number) => {
			filters.update(f => ({
				...f,
				priceRange: {
					...f.priceRange,
					[type]: value
				}
			}));
			displaySettings.update(s => ({ ...s, currentPage: 1 }));
		},

		updateRating: (rating: number) => {
			filters.update(f => ({ ...f, selectedRating: rating }));
			displaySettings.update(s => ({ ...s, currentPage: 1 }));
		},

		toggleFreeOnly: (showFreeOnly: boolean) => {
			filters.update(f => ({ ...f, showFreeOnly }));
			displaySettings.update(s => ({ ...s, currentPage: 1 }));
		},

		updateViewMode: (viewMode: 'grid' | 'list') => {
			displaySettings.update(s => ({ ...s, viewMode }));
		},

		toggleFilters: () => {
			displaySettings.update(s => ({ ...s, showFilters: !s.showFilters }));
		},

		goToPage: (page: number) => {
			displaySettings.update(s => ({ ...s, currentPage: page }));
		}
	};
}

export const courseFilterStore = createCourseFilterStore();

// Derived store for filtering and sorting courses
export const filteredAndSortedCourses = derived(
	[courseFilterStore.filters],
	([filters]) => (courses: Course[]) => {
		// Filter courses
		let filtered = courses.filter((course: Course) => {
			// Search filter
			if (filters.searchQuery &&
				!course.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
				!course.owner.firstName.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
				!course.owner.lastName.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
				return false;
			}

			// Category filter
			if (filters.selectedCategories.length > 0 &&
				!course.categories.some(cat => filters.selectedCategories.includes(cat))) {
				return false;
			}

			// Price filter
			if (course.price < filters.priceRange.min || course.price > filters.priceRange.max) {
				return false;
			}

			// Free only filter
			if (filters.showFreeOnly && course.price > 0) {
				return false;
			}

			// Note: Difficulty and rating filters would need to be added to the Course type
			// or mapped from existing data

			return true;
		});

		// Sort courses
		switch (filters.sortBy) {
			case 'price-low':
				filtered.sort((a: Course, b: Course) => a.price - b.price);
				break;
			case 'price-high':
				filtered.sort((a: Course, b: Course) => b.price - a.price);
				break;
			case 'students':
				filtered.sort((a: Course, b: Course) => b.students - a.students);
				break;
			case 'newest':
				filtered.sort((a: Course, b: Course) =>
					new Date(b.created).getTime() - new Date(a.created).getTime()
				);
				break;
			default: // popular
				filtered.sort((a: Course, b: Course) => b.students - a.students);
		}

		return filtered;
	}
);

// Derived store for pagination
export const paginatedCourses = derived(
	[courseFilterStore.displaySettings],
	([displaySettings]) => (filteredCourses: Course[]) => {
		const start = (displaySettings.currentPage - 1) * displaySettings.coursesPerPage;
		const end = start + displaySettings.coursesPerPage;
		return filteredCourses.slice(start, end);
	}
);

export const totalPages = derived(
	[courseFilterStore.displaySettings],
	([displaySettings]) => (filteredCourses: Course[]) => {
		return Math.ceil(filteredCourses.length / displaySettings.coursesPerPage);
	}
);