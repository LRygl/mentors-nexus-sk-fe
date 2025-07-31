// src/lib/utils/faq-loader.ts
import { faqStore } from '$lib/stores/faq-store';

/**
 * Load FAQ data - categories and published FAQs
 */
export async function loadFAQData(): Promise<void> {
	try {
		await faqStore.loadAllData();
	} catch (error) {
		console.error('Failed to load FAQ data:', error);
		throw error;
	}
}