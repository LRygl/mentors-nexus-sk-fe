import { renderComponent} from '$lib/components/ui/data-table';
import DataTableActions from '$lib/components/data-table-actions.svelte'
import type { Company } from '$lib/types/company';
import type { ColumnDef } from '@tanstack/table-core';

export const columns: ColumnDef<Company>[] = [
	{
		accessorKey: "id",
		header: "Id",
	},
	{
		accessorKey: "name",
		header: "Jméno",
	},
	{
		accessorKey: "uuid",
		header: "UUID",
	},
	{
		accessorKey: "registrationNumber",
		header: "Reg.No",
	},
	{
		accessorKey: "createdDate",
		header: "Created",
	},
	{
		accessorKey: "updatedDate",
		header: "Updated",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}

];