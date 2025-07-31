// lib/types/course-filters.ts

export interface PriceRange {
	min: number;
	max: number;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'popular' | 'newest' | 'rating' | 'price-low' | 'price-high' | 'students';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CourseFilters {
	searchQuery: string;
	selectedCategories: string[];
	priceRange: PriceRange;
	selectedDifficulty: Difficulty[];
	selectedDuration: string[];
	selectedRating: number;
	showFreeOnly: boolean;
	sortBy: SortOption;
}

export interface CourseDisplaySettings {
	viewMode: ViewMode;
	currentPage: number;
	coursesPerPage: number;
	showFilters: boolean;
}