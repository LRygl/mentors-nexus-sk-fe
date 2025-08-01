// stores/faqAdminStore.ts
import { readable } from 'svelte/store';

type FAQ = {
	id: string;
	question: string;
	answer: string;
};

export class FAQAdminStore {
	// Internal reactive state using $state
	faqs = $state<FAQ[]>([
		{
			id: '1',
			question: 'What is Svelte?',
			answer: 'A compiler for web apps.'
		}
	]);
	isLoading = $state(false);
	error = $state<string | null>(null);

	// Add a subscribe method to make it a Svelte store
	subscribe: (subscription: (value: this) => void) => () => void;

	constructor() {
		// Use Svelte's readable to create a store that emits `this` (the instance)
		const { subscribe } = readable<this>(this, (set) => {
			// On subscribe, immediately send current value
			set(this);

			// No need for unsubscribe logic unless you have side effects
			return () => {};
		});

		this.subscribe = subscribe;
	}

	// Your methods...
	addFAQ(faq: FAQ) {
		this.faqs = [...this.faqs, { ...faq, id: crypto.randomUUID() }];
	}

	async deleteFAQ(id: string) {
		// Prevent multple concurrent requests
		if (this.isLoading) return;


		// Store original FAQs for optimistic update
		const originalFaqStore = this.faqs;

		// Try to delete the faq by faq id in backend service
		try {
			this.isLoading = true;
			this.error = null;

			//Call Backend API
			// Move to separate API file
			const response = await fetch('http://localhost:8080/api/v1/faq/delete', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' }
			});

			if (!response.ok) {
				throw new Error(`Failed to delete FAQ: ${response.statusText}`);
			}

			// ✅ Success: Remove from local state
			this.faqs = this.faqs.filter((faq) => faq.id !== id);
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Unknown error';
			console.error(e);
			// Return the store to previous state
			this.faqs = originalFaqStore;
			console.log('Failed to delete FAQ');
		} finally {
			this.isLoading = false;
		}


	}

	setLoading(loading: boolean) {
		this.isLoading = loading;
	}

	clearError() {
		this.error = null;
	}
}

// Export instance
export const faqAdminStore = new FAQAdminStore();