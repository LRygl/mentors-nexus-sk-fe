import { ActionType } from '$lib/types';
import type { Component } from 'svelte';

export interface ActionItem {
	id: string;
	label: string;
	description?: string;
	icon: string;
	variant?: ActionType;
	disabled?: boolean;
	separator?: boolean; // Show separator after this item
}

export interface ActionGroup {
	title?: string;
	items: ActionItem[];
}

export interface ActionEvent {
	actionId: string;
	itemId: string;
	item?: any;
}

export interface DropdownEvent {
	itemId: string;
}

export interface ActionDropdownProps {
	itemId: string; // Unique identifier for the item this dropdown belongs to
	itemTitle?: string; // Title to show in dropdown header
	actions?: ActionGroup[]; // Array of action groups
	buttonVariant?: 'outline' | 'ghost' | 'secondary';
	buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
	disabled?: boolean;
	dropdownWidth?: string;
	position?: 'left' | 'right';
	isOpen?: boolean;
	class?: string;

	// Callback props for Svelte 5
	onaction?: (event: ActionEvent) => void;
	onopen?: (event: DropdownEvent) => void;
	onclose?: (event: DropdownEvent) => void;
}