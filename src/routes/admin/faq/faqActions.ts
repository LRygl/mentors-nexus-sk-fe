import { type ActionGroup, type ActionItem, ActionType, type FAQ, FAQStatus } from '$lib/types';
import { BookX, ArchiveRestore, BookCheck, History, Trash2, Archive, Download, Share2, Eye, Edit3 } from '@lucide/svelte';

export function getFAQActions(faq: FAQ): ActionGroup[] {
	const groups: ActionGroup[] = [];

	/*
	* DEFINE ACTIONS GROUP
	*/
	const actionItems: ActionItem[] = [
		{
			id: 'view',
			label: 'View Details',
			description: 'Open FAQ Details',
			icon: Eye,
			variant: ActionType.DEFAULT
		}
	];

	// Edit Action - Available for DRAFT and PUBLISHED ONLY
	if (faq.status !== FAQStatus.ARCHIVED) {
		actionItems.push({
			id: 'edit',
			label: 'Edit FAQ',
			description: 'Modify FAQ Content',
			icon: Edit3,
			variant: ActionType.SUCCESS
		});
	}

	// Publish/Unpublish - conditional based on FAQ Status
	if (faq.status === FAQStatus.DRAFT) {
		actionItems.push({
			id: 'publish',
			label: 'Publish',
			description: 'Make publicly visible',
			icon: BookCheck,
			variant: ActionType.SUCCESS,
		})
	} else if (faq.status === FAQStatus.PUBLISHED) {
		actionItems.push({
			id: 'unpublish',
			label: 'Unpublish',
			description: 'Revert to draft',
			icon: BookX,
			variant: ActionType.WARNING,
		})
	}

	// Push all action items above to 'Actions' group
	groups.push({
		title: 'Actions',
		items: actionItems,
	})

	/*
	* DEFINE UTILS GROUP
	*
	*/

	const utilityItems: ActionItem[] = [];

	// Share - only for published FAQs
	if (faq.status === FAQStatus.PUBLISHED) {
		utilityItems.push({
			id: 'share',
			label: 'Share Link',
			description: 'Copy public URL',
			icon: Share2,
			variant: ActionType.DEFAULT
		});
	}

	// History - always available
	utilityItems.push({
		id: 'history',
		label: 'View History',
		description: 'See changes',
		icon: History,
		variant: ActionType.DEFAULT
	});

	// Export - always available
	utilityItems.push({
		id: 'export',
		label: 'Export',
		description: 'Download as file',
		icon: Download,
		variant: ActionType.DEFAULT,
	});

	// Push all action items above to 'Actions' group
	groups.push({
		title: 'Utilities',
		items: utilityItems,
	})


	/*
	* DEFINE MANAGEMENT GROUP
	*
	*/

	const managementItems: ActionItem[] = [];

	// Archive/Restore - conditional based on status
	if (faq.status === FAQStatus.ARCHIVED) {
		managementItems.push({
			id: 'restore',
			label: 'Restore',
			description: 'Restore from archive',
			icon: ArchiveRestore,
			variant: ActionType.SUCCESS
		});
	} else {
		managementItems.push({
			id: 'archive',
			label: 'Archive',
			description: 'Move to archive',
			icon: Archive,
			variant: ActionType.WARNING
		});
	}

	// Delete - only for DRAFT and ARCHIVED
	if (faq.status === FAQStatus.DRAFT || faq.status === FAQStatus.ARCHIVED) {
		managementItems.push({
			id: 'delete',
			label: 'Delete',
			description: 'Permanent removal',
			icon: Trash2,
			variant: ActionType.DANGER
		});
	}

	// Push all action items above to 'Actions' group
	groups.push({
		title: 'Management',
		items: managementItems,
	})

	return groups;
}