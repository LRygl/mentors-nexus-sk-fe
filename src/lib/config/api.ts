import {dev} from '$app/environment';


export const API_CONFIG = {
	BASE_URL: dev
		? 'http://localhost:8080'
		: 'http://localhost:8080',
	PATH: 'api',
	VERSION: 'v1',
	ENDPOINTS: {
		CATEGORY: '/category',
		FAQ: '/faq',
		FAQ_CATEGORY: '/faq-category',
		USER: '/user',
		AUTH: '/auth',
		EVENT: '/event',
		ADMIN: {
			ADMIN_FAQ: '/admin/faq',
			ADMIN_FAQ_CATEGORY: '/admin/faq-category',
		}

		// Add other endpoints as needed
	},
	get FULL_BASE_URL() {
		return `${this.BASE_URL}/api/${this.VERSION}`;
	}
} as const;

// Helper function with proper typing
export function buildApiUrl(endpoint: string): string {
	return `${API_CONFIG.FULL_BASE_URL}${endpoint}`;
}