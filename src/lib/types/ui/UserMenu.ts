import type { Role } from '$lib/types/enums/Role';


export interface UserMenuAction {
	id: string;
	label?: string;
	icon?: string;
	href?: string;
	action?: string;
	type?: 'divider';
	roles?: Role[]; // If specified, only show for these roles
	badge?: string | number; // Optional badge (e.g., notification count)
}

export interface UserMenuConfig {
	actions: UserMenuAction[];
}
