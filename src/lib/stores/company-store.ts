import type { Company, CompanyStoreState } from '$lib/types/company';
import { get, writable } from 'svelte/store';
import { getAllCompanies } from '$lib/api/company-api';

function createCompanyStore() {
	const store = writable<CompanyStoreState>({
		data: [] as Company[],
		loading: false,
		error: null,
		loaded: false,
	});

	const { subscribe, set, update } = store;

	const companyStore = {
		subscribe,

		load: async (force = false) => {
			const state = get(store);

			if (state.loaded && !force) return state.data;

			update((state) => ({...state, loading: true, error: null}));

			try {
				const companies = await getAllCompanies();

				set({
					data: companies,
					loading: false,
					error: null,
					loaded: false,
				});

				return companies;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				update((s) => ({ ...s, loading: false, error: errorMessage }));
				throw error;
			}
		},



	}

	return companyStore;

}

export const companies = createCompanyStore();