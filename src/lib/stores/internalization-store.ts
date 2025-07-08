import { writable, derived, type Writable, type Readable } from 'svelte/store';

// Language code type
export type LanguageCode = 'en' | 'cs';

// Translation structure interface
interface Translations {
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
	},
	action: {
		copyToClipboard: string;
		view: string;
		details: string;
		delete: string;
	};
}

// Available languages
export const availableLanguages: Record<LanguageCode, string> = {
	en: 'English',
	cs: 'Česky',

};

// Current language store
export const currentLanguage: Writable<LanguageCode> = writable('cs');


// Translation messages
const messages: Record<LanguageCode, Translations> = {
	en: {
		errors: {
			loading_data: 'Error loading data',
			loading_users: 'Error loading users',
			loading_categories: 'Error loading categories',
			loading_companies: 'Error loading companies',
			loading_courses: 'Error loading courses',
			loading_products: 'Error loading products',
			network_error: 'Network connection failed',
			server_error: 'Server error occurred',
			unauthorized: 'You are not authorized to access this resource',
			not_found: 'Resource not found'
		},
		loading: {
			default: 'Loading...',
			users: 'Loading users...',
			categories: 'Loading categories...',
			courses: 'Loading courses...',
			companies: 'Loading companies...',
			products: 'Loading products...',
			saving: 'Saving...',
			deleting: 'Deleting...',
			updating: 'Updating...'
		},
		buttons: {
			try_again: 'Try Again',
			retrying: 'Retrying...',
			cancel: 'Cancel',
			save: 'Save',
			delete: 'Delete',
			edit: 'Edit',
			create: 'Create',
			close: 'Close'
		},
		common: {
			success: 'Success',
			warning: 'Warning',
			info: 'Information',
			confirmation: 'Are you sure?',
			previous: 'Previous',
			next: 'Next',
		},
		action: {
			copyToClipboard: "Copy to clipboard",
			view: "View",
			details: "Details",
			delete: "Delete",
		}
	},
	cs: {
		errors: {
			loading_data: 'Chyba při načítání dat',
			loading_users: 'Nelze načíst uživatele',
			loading_categories: 'Error al cargar categorías',
			loading_companies: 'Nelze načíst společnosti',
			loading_courses: 'Error al cargar cursos',
			loading_products: 'Error al cargar productos',
			network_error: 'Falló la conexión de red',
			server_error: 'Error del servidor',
			unauthorized: 'No tienes autorización para acceder a este recurso',
			not_found: 'Nebyl nalezen žádný záznam'
		},
		loading: {
			default: 'Načítání...',
			users: 'Načítání uživatelů...',
			categories: 'Cargando categorías...',
			courses: 'Cargando cursos...',
			companies: 'Načítání společnosti...',
			products: 'Cargando productos...',
			saving: 'Ukládání...',
			deleting: 'Odstraňování...',
			updating: 'Aktualizace...'
		},
		buttons: {
			try_again: 'Načíst znovu',
			retrying: 'Reintentando...',
			cancel: 'Zrušit',
			save: 'Uložit',
			delete: 'Odstranit',
			edit: 'Upravit',
			create: 'Vytvořit',
			close: 'Zavřít'
		},
		common: {
			success: 'Éxito',
			warning: 'Advertencia',
			info: 'Información',
			confirmation: '¿Estás seguro?',
			previous: 'Předchozí',
			next: 'Následující'
		},
		action: {
			copyToClipboard: "Kopírovat ID",
			view: "Zobrazit",
			details: "Detail",
			delete: "Odstranit",
		}
	}
};


// Derived store for current translations
export const t: Readable<Translations> = derived(currentLanguage, ($currentLanguage) => {
	return messages[$currentLanguage] || messages.cs;
});

// Type for translation keys with dot notation
export type TranslationKey =
	| `errors.${keyof Translations['errors']}`
	| `loading.${keyof Translations['loading']}`
	| `buttons.${keyof Translations['buttons']}`
	| `common.${keyof Translations['common']}`;

// Helper function to get nested translation
export function translate(key: TranslationKey, lang?: LanguageCode): string {
	const translations = lang ? messages[lang] : messages[currentLanguage.value];
	const keys = key.split('.') as [keyof Translations, string];
	const section = translations[keys[0]];
	return (section as any)[keys[1]] || key;
}

// Helper function to change language
export function setLanguage(lang: LanguageCode): void {
	if (availableLanguages[lang]) {
		currentLanguage.set(lang);
		// Optionally save to localStorage
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('app-language', lang);
		}
	}
}

// Initialize language from localStorage on app start
export function initializeLanguage(): void {
	if (typeof localStorage !== 'undefined') {
		const savedLang = localStorage.getItem('app-language') as LanguageCode;
		if (savedLang && availableLanguages[savedLang]) {
			currentLanguage.set(savedLang);
		}
	}
}

// Store interface type (for your async stores)
export interface AsyncStore<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
}