import type { Translations } from '$lib/types/translation';

export const cs: Translations = {
	errors: {
		loading_data: 'Chyba při načítání dat',
		loading_users: 'Nelze načíst uživatele',
		loading_categories: 'Nelze načíst kategorie', // Fixed from Spanish
		loading_companies: 'Nelze načíst společnosti',
		loading_courses: 'Nelze načíst kurzy', // Fixed from Spanish
		loading_products: 'Nelze načíst produkty', // Fixed from Spanish
		network_error: 'Selhalo síťové připojení', // Fixed from Spanish
		server_error: 'Chyba serveru', // Fixed from Spanish
		unauthorized: 'Nemáte oprávnění k přístupu k tomuto zdroji', // Fixed from Spanish
		not_found: 'Nebyl nalezen žádný záznam'
	},
	loading: {
		default: 'Načítání...',
		users: 'Načítání uživatelů...',
		categories: 'Načítání kategorií...', // Fixed from Spanish
		courses: 'Načítání kurzů...', // Fixed from Spanish
		companies: 'Načítání společnosti...',
		products: 'Načítání produktů...', // Fixed from Spanish
		saving: 'Ukládání...',
		deleting: 'Odstraňování...',
		updating: 'Aktualizace...'
	},
	buttons: {
		try_again: 'Načíst znovu',
		retrying: 'Opakování...', // Fixed from Spanish
		cancel: 'Zrušit',
		save: 'Uložit',
		delete: 'Odstranit',
		edit: 'Upravit',
		create: 'Vytvořit',
		close: 'Zavřít'
	},
	common: {
		success: 'Úspěch', // Fixed from Spanish
		warning: 'Varování', // Fixed from Spanish
		info: 'Informace', // Fixed from Spanish
		confirmation: 'Jste si jisti?', // Fixed from Spanish
		previous: 'Předchozí',
		next: 'Následující',
		action: 'Akce',
		login: "Přihlášení"
	},
	action: {
		noAvailableAction: 'Není dostupné',
		copyToClipboard: 'Kopírovat ID',
		view: 'Zobrazit',
		details: 'Detail',
		delete: 'Odstranit',
		activate: 'Aktivovat',
		deactivate: 'Deaktivovat'
	},
	column: {
		user: {
			id: 'ID',
			user: 'Uživatel',
			firstName: 'Jméno',
			lastName: 'Příjmení',
			email: 'E-Mail',
			telephone: 'Telefon',
			uuid: 'UUID',
			lastLoginDate: 'Poslední přihlášení',
			role: 'Role'
		},
		course: {
			courseName: 'Název'
		}
	},
	page: {
		about_us: {
			title: "O Nás",
			subTitle: "Text o nás",
		}
	},
	nav: {
		courses: "Kurzy",
		about_us: "O Nás",
		support: "Podpora",
		admin: "Administrace",
		home: "Domů"

	}
};