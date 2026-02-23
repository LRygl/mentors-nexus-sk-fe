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
		CHECKOUT: '/store/checkout',
		SUPPORT: '/support'
	},

	// ============================================
	// USER ROUTES (Authenticated users)
	// ============================================
	USER: {
		DASHBOARD: '/account/dashboard',
		MY_COURSES: '/account/my-learning',
		PROFILE: '/account/profile',
		SETTINGS: '/account/settings',
		ORDERS: '/account/orders',
		INVOICES: '/account/invoices',
		INVOICE_DETAIL: (id: string | number) => `/account/invoices/${id}`,
		SUBSCRIPTIONS: '/account/subscriptions',
		COURSES: '/account/courses'
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
		//Different notation used for url path with parameter
		courseCategory: (id: string | number) => `/admin/course-category/${id}`,
		LESSON: '/admin/lesson',
		LEGAL_TOPIC: '/admin/legal-topic'
	}
} as const;
