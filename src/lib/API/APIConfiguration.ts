// ============================================
// API endpoint configuration for Backend API Calls
// ============================================

import {dev} from '$app/environment';

export const API_CONFIG = {
	BASE_URL: dev
		? 'http://localhost:8080'
		: 'http://localhost:8080', // Update for production
	PATH: 'api',
	VERSION: 'v1',

	ENDPOINTS: {
		FILES:{
			COURSE: '/files/course'
		},
		// Auth endpoints
		AUTH: {
			LOGIN: '/auth/login',
			REGISTER: '/auth/register',
			LOGOUT: '/auth/logout',
			REFRESH: '/auth/refresh',
			ME: '/auth/me',
			FORGOT_PASSWORD: '/auth/forgot-forgot-password',
			RESET_PASSWORD: '/auth/reset-forgot-password',
		},

		// Public endpoints
		CATEGORY: '/category',
		FAQ: '/faq',
		FAQ_CATEGORY: '/faq-category',
		LESSON: '/lesson',
		USER: '/user',
		EVENT: '/event',
		LEGAL: {
			TOPIC: '/legal/topic',
		},

		// Admin endpoints
		ADMIN: {
			FAQ: '/admin/faq',
			FAQ_CATEGORY: '/admin/faq-category',
			USER: '/user',
			COURSES: '/course',
			COURSE_CATEGORY: '/category',
			LESSONS: '/lesson',
			REPORTS: '/admin/reports',
			LEGAL_TOPIC: '/admin/legal/topic',
			LEGAL_SECTION: '/admin/legal/section',
			LEGAL_ITEM: '/admin/legal/item',
			SETTINGS: {
				THEME: '/admin/settings/theme',
			}
		}
	},
	get FULL_BASE_URL() {
		return `${this.BASE_URL}/${this.PATH}/${this.VERSION}`;
	}
} as const;

// Helper function with proper typing
export function buildApiUrl(endpoint: string): string {
	return `${API_CONFIG.FULL_BASE_URL}${endpoint}`;
}