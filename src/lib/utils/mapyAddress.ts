/**
 * Mapy.cz Address Suggest – shared logic for AddressInput and AddressAutocomplete.
 *
 * API docs: https://developer.mapy.com/rest-api/naseptavani/
 *
 * The API key is a browser-side public key. Restrict it to your domain
 * in the Mapy.cz developer console: https://developer.mapy.com/
 */

const MAPY_API_KEY = 'E0yFtFW1x4dvrtdJg6QMD0MCxfecY-0uMUyNLPObcjo';
const SUGGEST_URL = 'https://api.mapy.cz/v1/suggest';

// ── Country name → ISO 3166-1 alpha-2 ──────────────────────────────────────
// Covers Czech-language names returned by lang=cs, plus English fallbacks.
const COUNTRY_CODE_MAP: Record<string, string> = {
	// Czech names
	'česká republika': 'CZ',
	'slovensko': 'SK',
	'slovenská republika': 'SK',
	'německo': 'DE',
	'österreich': 'AT',
	'rakúsko': 'AT',
	'rakusko': 'AT',
	'polsko': 'PL',
	'maďarsko': 'HU',
	'madarsko': 'HU',
	'spojené státy americké': 'US',
	'spojené království': 'GB',
	'velká británie': 'GB',
	'francie': 'FR',
	'itálie': 'IT',
	'španělsko': 'ES',
	'nizozemsko': 'NL',
	'belgie': 'BE',
	'švýcarsko': 'CH',
	// English fallbacks
	'czech republic': 'CZ',
	czechia: 'CZ',
	slovakia: 'SK',
	germany: 'DE',
	austria: 'AT',
	poland: 'PL',
	hungary: 'HU',
	'united states': 'US',
	'united states of america': 'US',
	'united kingdom': 'GB',
	france: 'FR',
	italy: 'IT',
	spain: 'ES',
	netherlands: 'NL',
	belgium: 'BE',
	switzerland: 'CH',
};

// ── Types ───────────────────────────────────────────────────────────────────

export interface AddressSuggestion {
	/** Street + house number, e.g. "Václavské náměstí 837/11" */
	street: string;
	/** City name, e.g. "Praha" */
	city: string;
	/** Postal/ZIP code, e.g. "110 00" */
	postalCode: string;
	/** ISO 3166-1 alpha-2 country code, e.g. "CZ" — empty string if unknown */
	countryCode: string;
	/** Primary line shown in the dropdown (same as street) */
	label: string;
	/** Secondary line: city context, e.g. "Nové Město, Praha 1, Praha" */
	location: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function parseItem(item: any): AddressSuggestion {
	const struct: Array<{ name: string; type: string }> = item.regionalStructure ?? [];

	// Prefer the municipality (city), fall back to municipality_part (district)
	const city =
		struct.find((s) => s.type === 'regional.municipality')?.name ??
		struct.find((s) => s.type === 'regional.municipality_part')?.name ??
		'';

	const countryName = struct.find((s) => s.type === 'regional.country')?.name ?? '';
	const countryCode = COUNTRY_CODE_MAP[countryName.toLowerCase()] ?? '';

	return {
		street: item.name ?? '',
		city,
		postalCode: item.zip ?? '',
		countryCode,
		label: item.name ?? '',
		location: item.location ?? '',
	};
}

// Simple in-memory cache — resets on page reload, good enough for suggest calls
const cache = new Map<string, AddressSuggestion[]>();

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch up to 5 address suggestions for the given query string.
 * Silently returns an empty array on any error (network, bad API key, etc.)
 * so that the UI degrades gracefully rather than throwing.
 */
export async function fetchAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
	const trimmed = query.trim();
	if (trimmed.length < 3) return [];

	const cacheKey = trimmed.toLowerCase();
	const cached = cache.get(cacheKey);
	if (cached) return cached;

	try {
		const url =
			`${SUGGEST_URL}` +
			`?lang=cs` +
			`&limit=5` +
			`&type=regional.address` +
			`&apikey=${MAPY_API_KEY}` +
			`&query=${encodeURIComponent(trimmed)}`;

		const resp = await fetch(url);
		if (!resp.ok) return [];

		const data = await resp.json();
		const items: AddressSuggestion[] = (data.items ?? []).map(parseItem);
		cache.set(cacheKey, items);
		return items;
	} catch {
		return [];
	}
}
