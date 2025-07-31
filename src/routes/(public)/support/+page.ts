// src/routes/(public)/support/+page.ts
import type { PageLoad } from './$types';
import { getPublishedFAQs } from '$lib/api/faqAPI';
import { getVisibleFAQCategories } from '$lib/api/faqCategoryAPI';
import type { FAQ } from '$lib/types/faq';
import type { FAQCategory } from '$lib/types/faqCategory';

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Load both published FAQs and visible categories in parallel
		const [faqs, categories] = await Promise.all([
			getPublishedFAQs(),
			getVisibleFAQCategories()
		]);

		return {
			faqs: faqs as FAQ[],
			categories: categories as FAQCategory[],
			meta: {
				title: 'FAQ - Frequently Asked Questions',
				description: 'Find quick answers to common questions about our learning platform, courses, payments, and more.',
				keywords: 'FAQ, help, support, questions, answers, learning platform'
			}
		};
	} catch (error) {
		console.error('Failed to load FAQ data:', error);

		// Return empty arrays as fallback
		return {
			faqs: [] as FAQ[],
			categories: [] as FAQCategory[],
			error: error instanceof Error ? error.message : 'Failed to load FAQ data',
			meta: {
				title: 'FAQ - Frequently Asked Questions',
				description: 'Find quick answers to common questions about our learning platform.',
				keywords: 'FAQ, help, support'
			}
		};
	}
};