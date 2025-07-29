// FAQ Type Definitions

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

export interface SearchFilters {
	query: string;
	category: string;
}
