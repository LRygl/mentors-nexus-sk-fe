import { type ActionGroup, type ActionItem, ActionType, type FAQ, FAQStatus } from '$lib/types';
import {
	BookX,
	ArchiveRestore,
	BookCheck,
	History,
	Trash2,
	Archive,
	Download,
	Share2,
	Eye,
	Edit3,
	Edit,
	Copy,
	ShieldOff,
	Shield,
	RotateCcw,
	Mail
} from '@lucide/svelte';
import type { FAQCategory } from '$lib/types/entities/faqCategory';
import type { TableAction } from '$lib/types/ui/table';

export function getFAQCategoryActions(category: FAQCategory): TableAction[] {
	return [
		// Primary actions group
		{
			id: 'view',
			label: 'View Details',
			icon: Eye,
			variant: 'default'
		},
		{
			id: 'edit',
			label: 'Edit Category',
			icon: Edit,
			variant: 'default'
		},
		{
			id: 'duplicate',
			label: 'Duplicate',
			icon: Copy,
			variant: 'default'
		},
		// Divider between primary and secondary actions
		{
			id: 'divider-1',
			label: '',
			divider: true
		},
		// Secondary actions group
		{
			id: 'reset-password',
			label: 'Reset Password',
			icon: RotateCcw,
			variant: 'outline'
		},
		{
			id: 'send-email',
			label: 'Send Email',
			icon: Mail,
			variant: 'outline'
		},
		// Divider before destructive actions
		{
			id: 'divider-2',
			label: '',
			divider: true
		},
		// Destructive actions group
		{
			id: 'delete',
			label: 'Delete Category', // Fixed: was "Delete User"
			icon: Trash2,
			variant: 'destructive'
		}
	];
}