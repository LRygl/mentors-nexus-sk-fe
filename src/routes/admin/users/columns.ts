import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableActions from '$lib/components/DataTable/DataTableActions/data-table-actions.svelte'
import type { User } from '$lib/types/user';
import DataTableBadge from '$lib/components/data-table-badge.svelte';
import { Checkbox } from '$lib/components/ui/checkbox';
import { goto } from '$app/navigation';
import { deleteUser } from '$lib/api/user-api';
import { translation } from '$lib/stores/internalization-store';
import { get } from 'svelte/store';
import type { Translations } from '$lib/types/translation';

export function getColumns(translations: Translations): ColumnDef<User>[] {
	return [
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
			header: () => get(translation).column.user.firstName,
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
				return renderComponent(DataTableActions, {
					id: row.original.id.toString(),
					entityType: 'user',
					deleteFunction: deleteUser,
					onDeleted: (deletedId: string) => {
						// Handle user deletion
						console.log(`User ${deletedId} was deleted`);
					},
					onView: (id: string) => {
						goto(`/users/${id}`);
					},
					onDetails: (id: string) => {
						goto(`/users/${id}/profile`);
					}
				});
			}
		}
	];
}
