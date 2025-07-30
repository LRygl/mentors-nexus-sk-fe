// src/lib/types/faq.ts
export interface FAQItem {
	id: string;
	category: string;
	question: string;
	answer: string;
	tags: string[];
}

export interface FAQCategory {
	id: string;
	label: string;
	icon: any; // Lucide icon component
	count: number;
}

export interface FAQFilters {
	searchQuery: string;
	selectedCategory: string;
}

export interface FAQState {
	items: FAQItem[];
	categories: FAQCategory[];
	filters: FAQFilters;
	expandedItems: Set<string>;
}