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
		{
			id: 'divider',
			label: '',
			divider: true
		},
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
		{
			id: 'divider2',
			label: '',
			divider: true
		},
		{
			id: 'delete',
			label: 'Delete User',
			icon: Trash2,
			variant: 'destructive',
		}
	];
}