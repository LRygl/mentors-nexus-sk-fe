import type { TableColumn, TableConfig } from '$lib/types/ui/table';
import { type ActionGroup, type ActionItem, ActionType, type FAQ } from '$lib/types';
import { Edit, Eye,RotateCcw, Trash2 } from '@lucide/svelte';

export class FAQCategoryFAQTableConfigs {

	static FAQTableConfig(): TableConfig<FAQ> {
		return {
			idField: 'id',
			titleField: 'question',
			createButtonLabel: 'Link FAQ',
			loadingTitle: 'Loading FAQs',
			loadingDescription: 'Please wait while we fetch FAQ data',
			itemName: 'FAQ',
			itemNamePlural: 'FAQs',
			actionsInline: true,
		}
	}

	static FAQTableColumnsConfig(): TableColumn<FAQ>[] {
		return [
			{
				key: 'id',
				header: 'ID',
				searchable: false,
				cellClassName: 'font-mono text-xs text-slate-500'
			},
			{
				key: 'displayOrder',
				header: 'Order',
				searchable: false,
			},
			{
				key: 'question',
				header: 'Question',
				searchable: true,
			},
			{
				key: 'answer',
				header: 'Answer',
				searchable: true,
			},
		]
	}
	
	static FAQTableActionsConfig(item: FAQ): ActionGroup[] {
		const groups: ActionGroup[] = [];

		/** PRIMARY ACTIONS **/
		const primary: ActionItem[] = [
			{
				id: 'view',
				label: 'View FAQ',
				description: 'Open FAQ details',
				icon: Eye,
				variant: ActionType.DEFAULT
			},
			{
				id: 'edit',
				label: 'Edit FAQ',
				description: 'Modify category info',
				icon: Edit,
				variant: ActionType.DEFAULT
			}
		];

		groups.push({ title: 'Actions', items: primary });

		/** UTILITIES **/
		const utilities: ActionItem[] = [
			{
				id: 'unlink-faq',
				label: 'Unlink FAQ',
				description: 'Unlink FAQ from FAQ Category',
				icon: RotateCcw,
				variant: ActionType.WARNING
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

}
