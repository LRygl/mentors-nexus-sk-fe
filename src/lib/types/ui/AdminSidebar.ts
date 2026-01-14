export interface AdminSidebarChildItem {
	id: string;
	label: string;
	href: string;
}

export interface AdminSidebarNavItem {
	id: string;
	label: string;
	icon: string;
	href: string;
	children?: AdminSidebarChildItem[];
}

export interface AdminSidebarUserAction {
	id: string;
	label?: string;
	icon?: string;
	href?: string;
	action?: string;
	type?: 'divider';
}

export interface SidebarConfig {
	logo: {
		src: string;
		alt: string;
		title: string;
	};
	navigation: AdminSidebarNavItem[];
	userActions: AdminSidebarUserAction[];
}
