import { ROUTES } from '$lib/Config/routes.config';

export interface RoleRedirectConfig {
	role: string;
	path: string;
	priority: number;
	description?: string;
}

/**
 * Where to redirect each role after login
 */
export const ROLE_REDIRECTS: RoleRedirectConfig[] = [
	{
		role: 'ROLE_ADMIN',
		path: ROUTES.ADMIN.DASHBOARD,
		priority: 100,
		description: 'Full admin access'
	},
	{
		role: 'ADMIN',
		path: ROUTES.ADMIN.DASHBOARD,
		priority: 100,
		description: 'Full admin access (alternate)'
	},
	{
		role: 'USER',
		path: ROUTES.USER.MY_COURSES,
		priority: 10,
		description: 'Regular users'
	},
	{
		role: 'ROLE_USER',
		path: ROUTES.USER.MY_COURSES,
		priority: 10,
		description: 'Regular users (Spring Security style)'
	},
];

export const DEFAULT_REDIRECT = ROUTES.USER.MY_COURSES;
export const LOGOUT_REDIRECT = ROUTES.PUBLIC.LOGIN;