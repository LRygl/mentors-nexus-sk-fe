export type LanguageCode = 'en' | 'cs';

export interface Translations {
	errors: {
		loading_data: string;
		loading_users: string;
		loading_categories: string;
		loading_companies: string;
		loading_courses: string;
		loading_products: string;
		network_error: string;
		server_error: string;
		unauthorized: string;
		not_found: string;
	};
	loading: {
		default: string;
		users: string;
		categories: string;
		courses: string;
		companies: string;
		products: string;
		saving: string;
		deleting: string;
		updating: string;
	};
	buttons: {
		try_again: string;
		retrying: string;
		cancel: string;
		save: string;
		delete: string;
		edit: string;
		create: string;
		close: string;
	};
	common: {
		success: string;
		warning: string;
		info: string;
		confirmation: string;
		previous: string;
		next: string;
	};
	action: {
		noAvailableAction: string;
		copyToClipboard: string;
		view: string;
		details: string;
		delete: string;
	};
	column: {
		user: {
			firstName: string;
			lastName: string;
		}
	}
}

export type TranslationKey =
	| `errors.${keyof Translations['errors']}`
	| `loading.${keyof Translations['loading']}`
	| `buttons.${keyof Translations['buttons']}`
	| `common.${keyof Translations['common']}`
	| `action.${keyof Translations['action']}`;

export interface AsyncStore<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
}