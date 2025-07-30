import faqData from '$lib/data/faq-data.json';
import { faqActions } from '$lib/stores/faq-store';

export async function loadFAQData() {
	await faqActions.loadData(faqData);
}
