// ============================================
// Frontend route configuration
// ============================================

export const ROUTES = {
	// ============================================
	// PUBLIC ROUTES (No authentication required)
	// ============================================
	PUBLIC: {
		HOME: '/',
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		FORGOT_PASSWORD: '/auth/forgot-password',
		ABOUT: '/about-us',
		CONTACT: '/contact',
		TERMS: '/terms',
		COOKIES: '/cookies',
		PRIVACY: '/privacy',
		STORE: '/store',
		COURSE: '/store/course',
		LESSON: 'store/course/lesson',
		SUPPORT: '/support',
	},

	// ============================================
	// USER ROUTES (Authenticated users)
	// ============================================
	USER: {
		MY_COURSES: '/my-learning',
		PROFILE: '/profile',
		SETTINGS: '/settings',
		ORDERS: '/orders',
		INVOICES: '/invoices',
		SUBSCRIPTIONS: '/subscriptions',
		COURSES: '/course',
	},

	// ============================================
	// ADMIN ROUTES (Admin users only)
	// ============================================
	ADMIN: {
		DASHBOARD: '/admin/dashboard',
		USERS: '/admin/users',
		MEMBERS: '/admin/users/members',
		ADMINS: '/admin/users/admins',
		FAQ: '/admin/faq',
		FAQ_CATEGORIES: '/admin/faq-categories',
		SETTINGS: '/admin/settings',
		THEMES: '/admin/settings/theme',
		REPORTS: '/admin/reports',
		COURSE: '/admin/course',
		COURSE_CATEGORIES: '/admin/course-category',
		LESSON: '/admin/lesson',
		LEGAL_TOPIC: '/admin/legal-topic',
	},

} as const;
