import { renderSnippet } from '$lib/components/ui/data-table';
import { createRawSnippet } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent} from '$lib/components/ui/data-table';
import DataTableActions from '$lib/components/data-table-actions.svelte'
import type { Category } from '$lib/types/category';

export const columns: ColumnDef<Category>[] = [
	{
		accessorKey: "id",
		header: "Id",
	},
	{
		accessorKey: "name",
		header: "Jméno",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}

];