import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import type { FAQCategory } from '$lib/types/entities/faqCategory';
import { FAQPublicAPI, faqPublicAPI } from '$lib/API/Public/FAQPublicAPI';


export class FAQPublicStoreSvelte extends BaseStoreSvelte<
	FAQCategory,
	Partial<FAQCategory>,
	Partial<FAQCategory>,
	FAQPublicAPI
> {

	constructor() {
		super(faqPublicAPI);
	}

	async fetchAll(): Promise<FAQCategory[]> {
		this._loading = true;

		this._data = await this.apiService.getPublicFAQs();
		this._loading = false;
		return this._data;
	}
}

export const FAQPublicStore = new FAQPublicStoreSvelte();