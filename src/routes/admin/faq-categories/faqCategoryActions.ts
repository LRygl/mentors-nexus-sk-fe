import { type ActionGroup, type ActionItem, ActionType, type FAQ, FAQStatus } from '$lib/types';
import { BookX, ArchiveRestore, BookCheck, History, Trash2, Archive, Download, Share2, Eye, Edit3 } from '@lucide/svelte';
import type { FAQCategory } from '$lib/types/entities/faqCategory';

export function getFAQCategoryActions(faqCategory: FAQCategory): ActionGroup[] {
	const groups: ActionGroup[] = [];

	/*
	* DEFINE ACTIONS GROUP
	*/
	const actionItems: ActionItem[] = [
		{
			id: 'view',
			label: 'View Details',
			description: 'Open Category Details',
			icon: Eye,
			variant: ActionType.DEFAULT
		}
	];

	// Edit Action - Available for DRAFT and PUBLISHED ONLY
	actionItems.push({
		id: 'edit',
		label: 'Edit Category',
		description: 'Modify FAQ Category Content',
		icon: Edit3,
		variant: ActionType.SUCCESS
	});


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

	// Push all action items above to 'Actions' group
	groups.push({
		title: 'Management',
		items: managementItems,
	})

	return groups;
}