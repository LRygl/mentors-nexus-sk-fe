import { renderSnippet } from '$lib/components/ui/data-table';
import { createRawSnippet } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableActions from '$lib/components/data-table-actions.svelte'
import type { User } from '$lib/types/user';
import DataTableBadge from '$lib/components/data-table-badge.svelte';

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "id",
		header: "Id",
	},
	{
		accessorKey: "firstName",
		header: "Jméno",
	},
	{
		accessorKey: "lastName",
		header: "Příjmení",
	},
	{
		accessorKey: "email",
		header: "E-Mail",
	},
	{
		accessorKey: "uuid",
		header: "UUID",
	},
	{
		accessorKey: "lastloginDate",
		header: "Poslední Přihlášení",
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			return renderComponent(DataTableBadge, {
				variant: "default",
				value: row.getValue("role") as string  // Use 'value' instead of 'text'
			})
		}
	},
	{
		id: "actions",
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}

];