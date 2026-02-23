import type { UserMenuConfig } from '$lib/types/ui/UserMenu';
import { Role } from '$lib/types/enums/Role';
import { ROUTES } from '$lib/Config/routes.config';

/**
 * Define user menu actions for different contexts and roles
 */
export const userMenuConfigs: Record<string, UserMenuConfig> = {
	// Admin panel user menu
	admin: {
		actions: [
			{
				id: 'dashboard',
				label: 'Admin Dashboard',
				icon: 'LayoutDashboard',
				href: ROUTES.ADMIN.DASHBOARD,
				roles: [Role.ROLE_ADMIN, Role.ADMIN]
			},
			{
				id: 'main-site',
				label: 'Main Site',
				icon: 'House',
				href: ROUTES.PUBLIC.HOME,
				roles: [Role.ROLE_ADMIN, Role.ADMIN]
			},
			{
				id: 'profile',
				label: 'My Profile',
				icon: 'User',
				href: '/admin/profile',
				roles: [Role.ROLE_ADMIN, Role.ADMIN]
			},
			{
				id: 'preferences',
				label: 'Preferences',
				icon: 'Settings',
				href: '/admin/preferences',
				roles: [Role.ROLE_ADMIN, Role.ADMIN]
			},

			{
				id: 'divider1',
				type: 'divider',
				roles: []
			},
			{
				id: 'logout',
				label: 'Logout',
				icon: 'LogOut',
				href: '/',
				action: 'logout',
				roles: [Role.ROLE_ADMIN, Role.ADMIN]
			},
		]
	},

	// Main site user menu for members/customers
	main: {
		actions: [
			{
				id: 'dashboard',
				label: 'Dashboard',
				icon: 'LayoutDashboard',
				href: ROUTES.USER.DASHBOARD,
				roles: [Role.USER]
			},
			{
				id: 'my-learning',
				label: 'My Learning',
				icon: 'GraduationCap',
				href: ROUTES.USER.MY_COURSES,
				roles: [Role.USER]
			},
			{
				id: 'profile',
				label: 'My Profile',
				icon: 'User',
				href: ROUTES.USER.PROFILE,
				roles: []
			},
			{
				id: 'divider1',
				type: 'divider',
				roles: []
			},
			{
				id: 'invoices',
				label: 'Invoices',
				icon: 'FileText',
				href: ROUTES.USER.INVOICES,
				roles: []
			},
			{
				id: 'divider2',
				type: 'divider',
				roles: []
			},
			{
				id: 'logout',
				label: 'Logout',
				icon: 'LogOut',
				action: 'logout',
				roles: []
			}
		]
	}
};

/**
 * Get the appropriate menu config based on user role
 */
export function getMenuConfigForRole(role: Role | string | undefined): UserMenuConfig {
	switch (role) {
		case Role.ROLE_ADMIN || Role.ADMIN:
			return userMenuConfigs.admin;
		case Role.USER:
			return userMenuConfigs.main;
		default:
			// For guests or unknown roles, return a minimal config
			return {
				actions: [
					{
					id: 'logout',
					label: 'Logout',
					icon: 'LogOut',
					action: 'logout',
					roles: []
				}]
			};
	}
}