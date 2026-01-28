// ============================================
// API endpoint configuration for Backend API Calls
// ============================================

import {dev} from '$app/environment';

// Build-time environment variable (local/staging override)
const explicitBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_CONFIG = {
	/*	BASE_URL: dev
		? 'http://localhost:8080'
		: 'http://localhost:8080', // Update for production
*/
	PATH: 'api',
	VERSION: 'v1',

	ENDPOINTS: {
		FILES: {
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
			RESET_PASSWORD: '/auth/reset-forgot-password'
		},

		// Public endpoints
		CATEGORY: '/category',
		FAQ: '/faq',
		FAQ_CATEGORY: '/faq-category',
		LESSON: '/lesson',
		USER: '/user',
		EVENT: '/event',
		VIDEO_STREAM: '/video',
		LEGAL: {
			TOPIC: '/legal/topic'
		},

		// Admin endpoints
		ADMIN: {
			FAQ: '/admin/faq',
			FAQ_CATEGORY: '/admin/faq-category',
			USER: '/user',
			COURSES: '/course',
			ENROLLMENTS: '/admin/enrollments',
			COURSE_CATEGORY: '/category',
			LESSONS: '/lesson',
			REPORTS: '/admin/reports',
			LEGAL_TOPIC: '/admin/legal/topic',
			LEGAL_SECTION: '/admin/legal/section',
			LEGAL_ITEM: '/admin/legal/item',
			SETTINGS: {
				THEME: '/admin/settings/theme'
			}
		}
	},

	// Determine BASE_URL based on environment
	get BASE_URL() {
		// 1️⃣ Explicit override (local dev or staging)
		if (explicitBaseUrl) {
			return explicitBaseUrl.replace(/\/$/, '');
		}

		// 2️⃣ Local development fallback
		if (dev) {
			return 'http://localhost:8080';
		}

		// 3️⃣ Production: same-origin (CloudFront routes /api/*)
		return '';
	},

	get FULL_BASE_URL() {
		const base = this.BASE_URL;

		// If no base URL (production same-origin), start with /
		if (!base) {
			return `/${this.PATH}/${this.VERSION}`;
		}

		// Otherwise include the base URL
		return `${base}/${this.PATH}/${this.VERSION}`;
	}
} as const;

// Helper function with proper typing
export function buildApiUrl(endpoint: string): string {
	return `${API_CONFIG.FULL_BASE_URL}${endpoint}`;
}