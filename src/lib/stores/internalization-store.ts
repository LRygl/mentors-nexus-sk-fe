import { writable, derived, type Writable, type Readable, get } from 'svelte/store';
import type { LanguageCode, TranslationKey, Translations } from '$lib/types/translation';
import { availableLanguages, messages } from '$lib/language/translations';

// Current language store
export const currentLanguage: Writable<LanguageCode> = writable('cs');

// Helper function to get nested translation
export function translate(key: TranslationKey, lang?: LanguageCode): string {
	const translations = lang ? messages[lang] : messages[get(currentLanguage)];
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

// Derived store for current translations
export const translation: Readable<Translations> = derived(currentLanguage, ($currentLanguage) => {
	return messages[$currentLanguage] || messages.cs;
});
