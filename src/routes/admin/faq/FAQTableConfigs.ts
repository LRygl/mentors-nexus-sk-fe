import type { TableColumn, TableConfig } from '$lib/types/ui/table';
import { type ActionGroup, type ActionItem, ActionType, type FAQ, FAQStatus } from '$lib/types';
import { BookCheck, BookX, Edit, Eye, RotateCcw, Trash2 } from '@lucide/svelte';


export class FAQTableConfigs {

	static FAQTableConfig(): TableConfig<FAQ> {
		return {
			idField: 'id',
			titleField: 'question',
			createButtonLabel: 'Create FAQ',
			loadingTitle: 'Loading FAQs',
			loadingDescription: 'Please wait while we fetch FAQ data',
			itemName: 'FAQ',
			itemNamePlural: 'FAQs',
			actionsInline: false,
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
			{
				key: 'isPublished',
				header: 'Published',
				searchable: true,
			},
			{
				key: 'category.name',
				header: 'Category',
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
				description: 'Modify FAQ info',
				icon: Edit,
				variant: ActionType.DEFAULT
			}
		];

		groups.push({ title: 'Actions', items: primary });

		/** UTILITIES **/
		const utilities: ActionItem[] = [];


		if (item.category != null) {
			utilities.push({
					id: 'unlink-faq',
					label: 'Unlink FAQ',
					description: 'Unlink FAQ from Category',
					icon: RotateCcw,
					variant: ActionType.WARNING
				})
		} else {
			utilities.push({
				id: 'link-faq',
				label: 'Link FAQ',
				description: 'Link FAQ to Category',
				icon: RotateCcw,
				variant: ActionType.WARNING
			})
		}


		// Publish/Unpublish - conditional based on FAQ Status
		if (item.status === FAQStatus.DRAFT) {
			utilities.push({
				id: 'publish',
				label: 'Publish',
				description: 'Make publicly visible',
				icon: BookCheck,
				variant: ActionType.SUCCESS,
			})
		} else if (item.status === FAQStatus.PUBLISHED) {
			utilities.push({
				id: 'unpublish',
				label: 'Unpublish',
				description: 'Revert to draft',
				icon: BookX,
				variant: ActionType.WARNING,
			})
		}



		groups.push({ title: 'Utilities', items: utilities });

		/*
		 * MANAGEMENT
		 */
		const management: ActionItem[] = [
			{
				id: 'delete',
				label: 'Delete FAQ',
				description: 'Permanent removal',
				icon: Trash2,
				variant: ActionType.DANGER
			}
		];

		groups.push({ title: 'Management', items: management });

		return groups;
	}


}