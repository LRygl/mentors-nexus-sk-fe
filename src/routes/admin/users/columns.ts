import { renderSnippet } from '$lib/components/ui/data-table';
import { createRawSnippet } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableActions from '$lib/components/data-table-actions.svelte'
import type { User } from '$lib/types/user';
import DataTableBadge from '$lib/components/data-table-badge.svelte';
import { Checkbox } from '$lib/components/ui/checkbox';

export const columns: ColumnDef<User>[] = [
	{
		id: "select",
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate:
					table.getIsSomePageRowsSelected() &&
					!table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				"aria-label": "Select all",
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				"aria-label": "Select row",
			}),
		enableSorting: false,
		enableHiding: false,
	},
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
			return renderComponent(DataTableActions, {
				id: row.original.id,



			});
		}
	}

];