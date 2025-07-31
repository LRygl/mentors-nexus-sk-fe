import type { LanguageCode, Translations } from '$lib/types/translation';
import { en } from '$lib/language/translations/en';
import { cs } from '$lib/language/translations/cs';


export const messages: Record<LanguageCode, Translations> = {
	en,
	cs
};

export const availableLanguages: Record<LanguageCode, string> = {
	en: 'English',
	cs: 'Česky'
};