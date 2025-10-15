import type { UserMenuConfig } from '$lib/types/ui/UserMenu';
import { Role } from '$lib/types/enums/Role';

/**
 * Define user menu actions for different contexts and roles
 */
export const userMenuConfigs: Record<string, UserMenuConfig> = {
	// Admin panel user menu
	admin: {
		actions: [
			{
				id: 'profile',
				label: 'My Profile',
				icon: 'User',
				href: '/admin/profile',
				roles: [Role.USER]
			},
			{
				id: 'preferences',
				label: 'Preferences',
				icon: 'Settings',
				href: '/admin/preferences',
				roles: [Role.USER]
			},
			{
				id: 'help',
				label: 'Help & Support',
				icon: 'HelpCircle',
				href: '/admin/help',
				roles: []
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
				action: 'logout',
				roles: []
			}
		]
	},

	// Main site user menu for members/customers
	main: {
		actions: [
			{
				id: 'dashboard',
				label: 'Dashboard',
				icon: 'LayoutDashboard',
				href: '/dashboard',
				roles: []
			},
			{
				id: 'profile',
				label: 'My Profile',
				icon: 'User',
				href: '/profile',
				roles: []
			},
			{
				id: 'divider1',
				type: 'divider',
				roles: []
			},
			// Member/Customer specific items
			{
				id: 'orders',
				label: 'Orders',
				icon: 'ShoppingBag',
				href: '/orders',
				roles: []
			},
			{
				id: 'invoices',
				label: 'Invoices',
				icon: 'FileText',
				href: '/invoices',
				roles: []
			},
			{
				id: 'subscriptions',
				label: 'Subscriptions',
				icon: 'CreditCard',
				href: '/subscriptions',
				roles: [],
				badge: 2 // Example: 2 active subscriptions
			},
			{
				id: 'courses',
				label: 'My Courses',
				icon: 'GraduationCap',
				href: '/courses',
				roles: []
			},
			{
				id: 'divider2',
				type: 'divider',
				roles: []
			},
			{
				id: 'settings',
				label: 'Settings',
				icon: 'Settings',
				href: '/settings',
				roles: []
			},
			{
				id: 'help',
				label: 'Help Center',
				icon: 'HelpCircle',
				href: '/help',
				roles: []
			},
			{
				id: 'divider3',
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
	},

	// Mixed - for areas accessible by multiple roles
	mixed: {
		actions: [
			{
				id: 'admin-panel',
				label: 'Admin Panel',
				icon: 'Shield',
				href: '/admin',
				roles: []
			},
			{
				id: 'dashboard',
				label: 'Dashboard',
				icon: 'LayoutDashboard',
				href: '/dashboard',
				roles: []
			},
			{
				id: 'profile',
				label: 'My Profile',
				icon: 'User',
				href: '/profile',
				roles: []
			},
			{
				id: 'divider1',
				type: 'divider',
				roles: []
			},
			{
				id: 'orders',
				label: 'Orders',
				icon: 'ShoppingBag',
				href: '/orders',
				roles: []
			},
			{
				id: 'courses',
				label: 'My Courses',
				icon: 'GraduationCap',
				href: '/courses',
				roles: []
			},
			{
				id: 'divider2',
				type: 'divider',
				roles: []
			},
			{
				id: 'settings',
				label: 'Settings',
				icon: 'Settings',
				href: '/settings',
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
