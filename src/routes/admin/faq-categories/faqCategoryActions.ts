import { type ActionGroup, type ActionItem, ActionType, type FAQ, FAQStatus } from '$lib/types';
import {
	Trash2,
	Eye,
	Edit,
	Copy,
	RotateCcw,
	Mail
} from '@lucide/svelte';
import type { FAQCategory } from '$lib/types/entities/faqCategory';

//TODO Fix the implementation to use ActionGroup[] instead of TableAction

export function getFAQCategoryActions(category: FAQCategory): ActionGroup[] {
	const groups: ActionGroup[] = [];

	/*
	 * PRIMARY ACTIONS
	 */
	const primary: ActionItem[] = [
		{
			id: 'view',
			label: 'View Details',
			description: 'Open category details',
			icon: Eye,
			variant: ActionType.DEFAULT
		},
		{
			id: 'edit',
			label: 'Edit Category',
			description: 'Modify category info',
			icon: Edit,
			variant: ActionType.DEFAULT
		},
		{
			id: 'duplicate',
			label: 'Duplicate',
			description: 'Create a copy',
			icon: Copy,
			variant: ActionType.DEFAULT
		}
	];

	groups.push({ title: 'Actions', items: primary });

	/*
	 * UTILITIES
	 */
	const utilities: ActionItem[] = [
		{
			id: 'reset-password',
			label: 'Reset Password',
			description: 'Force reset linked account',
			icon: RotateCcw,
			variant: ActionType.WARNING
		},
		{
			id: 'send-email',
			label: 'Send Email',
			description: 'Notify related users',
			icon: Mail,
			variant: ActionType.DEFAULT
		}
	];

	groups.push({ title: 'Utilities', items: utilities });

	/*
	 * MANAGEMENT
	 */
	const management: ActionItem[] = [
		{
			id: 'delete',
			label: 'Delete Category',
			description: 'Permanent removal',
			icon: Trash2,
			variant: ActionType.DANGER
		}
	];

	groups.push({ title: 'Management', items: management });

	return groups;
}
