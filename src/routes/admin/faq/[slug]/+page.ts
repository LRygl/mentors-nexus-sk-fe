import { faqStore } from '$lib/stores/defaults/faqStore.svelte';
import type { PageLoad } from './$types';
import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {

	//Load data from the FAQ Store
	const faq = await faqStore.loadItem(params.slug);

	if (!faq) {
		error(404, {
			message: `FAQ with ID ${params.slug} not found`
		});
	}

	// Ensure categories are loaded
	let categories = faqCategoryStore.data;
	if (categories.length === 0) {
		await faqCategoryStore.loadPage(0, 100); // Load all categories
		categories = faqCategoryStore.data;
	}

	return {
		faq,
		categories
	};

};