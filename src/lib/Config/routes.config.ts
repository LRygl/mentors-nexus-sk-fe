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
		RESET_PASSWORD: '/auth/reset-password',
		ABOUT: '/about',
		CONTACT: '/contact',
		TERMS: '/terms',
		PRIVACY: '/privacy',
	},

	// ============================================
	// USER ROUTES (Authenticated users)
	// ============================================
	USER: {
		DASHBOARD: '/dashboard',
		PROFILE: '/profile',
		SETTINGS: '/settings',
		ORDERS: '/orders',
		INVOICES: '/invoices',
		SUBSCRIPTIONS: '/subscriptions',
		COURSES: '/courses',
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
		REPORTS: '/admin/reports',
	},

} as const;
