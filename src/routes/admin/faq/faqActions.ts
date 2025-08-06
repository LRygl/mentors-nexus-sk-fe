import Edit3 from 'lucide-svelte/icons/edit-3';
import Eye from 'lucide-svelte/icons/eye';
import Copy from 'lucide-svelte/icons/copy';
import Share2 from 'lucide-svelte/icons/share-2';
import Download from 'lucide-svelte/icons/download';
import Archive from 'lucide-svelte/icons/archive';
import Trash2 from 'lucide-svelte/icons/trash-2';
import History from 'lucide-svelte/icons/history';
import type { ActionGroup } from '$lib/types';
import { ActionType} from '$lib/types';
export function getFAQActions(canEdit: boolean = true, canDelete: boolean = true): ActionGroup[] {
	return [
		{
			title: 'Actions',
			items: [
				{
					id: 'view',
					label: 'View Details',
					description: 'Open FAQ details',
					icon: Eye,
					variant: ActionType.DEFAULT
				},
				{
					id: 'edit',
					label: 'Edit FAQ',
					description: 'Modify content',
					icon: Edit3,
					variant: ActionType.SUCCESS,
					disabled: !canEdit
				},
				{
					id: 'duplicate',
					label: 'Duplicate',
					description: 'Create a copy',
					icon: Copy,
					variant: ActionType.DEFAULT,
					separator: true
				}
			]
		},
		{
			title: 'Utilities',
			items: [
				{
					id: 'share',
					label: 'Share Link',
					description: 'Copy public URL',
					icon: Share2,
					variant: ActionType.DEFAULT
				},
				{
					id: 'history',
					label: 'View History',
					description: 'See changes',
					icon: History,
					variant: ActionType.DEFAULT
				},
				{
					id: 'export',
					label: 'Export',
					description: 'Download as file',
					icon: Download,
					variant: ActionType.DEFAULT,
					separator: true
				}
			]
		},
		{
			title: 'Management',
			items: [
				{
					id: 'archive',
					label: 'Archive',
					description: 'Move to archive',
					icon: Archive,
					variant: ActionType.WARNING
				},
				{
					id: 'delete',
					label: 'Delete',
					description: 'Permanent removal',
					icon: Trash2,
					variant: ActionType.DANGER,
					disabled: !canDelete
				}
			]
		}
	];
}