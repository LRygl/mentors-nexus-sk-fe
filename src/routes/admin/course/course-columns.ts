import { renderSnippet } from '$lib/components/ui/data-table';
import { createRawSnippet } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent} from '$lib/components/ui/data-table';
import DataTableActions from '$lib/components/DataTable/DataTableActions/data-table-actions.svelte'
import { type Course, CourseStatus } from '$lib/types/course';
import DataTableBadge from '$lib/components/data-table-badge.svelte';
import { getStatusConfig } from '$lib/utils/course-status';
import { Checkbox } from '$lib/components/ui/checkbox';

export const courseColumns: ColumnDef<Course>[] = [
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
		accessorKey: "name",
		header: "Název",
	},
	{
		accessorKey: "owner",
		header: "Owner",
		cell: ({ row }) => {
			const owner = row.getValue("owner");

			const ownerCellSnippet = createRawSnippet<[any]>((getOwner) => {
				const ownerData = getOwner();

				if (!ownerData) {
					return {
						render: () => `<div class="text-gray-500">No owner</div>`
					};
				}

				// Generate initials for avatar
				const initials = `${ownerData.firstName.charAt(0)}${ownerData.lastName.charAt(0)}`;

				return {
					render: () => `
          <button 
            class="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors text-left w-full"
            onclick="window.location.href='/admin/users/${ownerData.id}'"
          >
            <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
              ${initials}
            </div>
            <div class="flex flex-col">
              <span class="font-medium">${ownerData.firstName} ${ownerData.lastName}</span>
              <span class="text-sm text-gray-500">${ownerData.email}</span>
            </div>
          </button>
        `
				};
			});

			return renderSnippet(ownerCellSnippet, owner);
		}
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue("status") as CourseStatus;
			const config = getStatusConfig(status);

			return renderComponent(DataTableBadge, {
				variant: config.variant,
				value: config.label
			});
		}
	},
	{
		accessorKey: "lessons",
		header: () => {
			const lessonsHeaderSnippet = createRawSnippet(()=> ({
				render: () => `<div class="text-center">Lessons</div>`,
			}));

			return renderSnippet(lessonsHeaderSnippet,"");
		},
		cell: ({ row }) => {
			const lessons = row.getValue("lessons") as any[];
			const lessonCount = lessons ? lessons.length : 0;

			const lessonCountSnippet = createRawSnippet<[number]>((getCount) => {
				const count = getCount();
				return {
					render: () => `<div class="text-center">${count}</div>`,
				};
			});

			return renderSnippet(lessonCountSnippet, lessonCount);
		}
	},
	{
		accessorKey: "uuid",
		header: "UUID",
	},



	//Amount column has special extension - as i can have a separate userColumns definition for each table taht is passed to data
	//table this could prove useful
	{
		accessorKey: "price",
		header: () => {
			const amountHeaderSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-right">Cena</div>`,
			}));
			return renderSnippet(amountHeaderSnippet, "");
		},
		cell: ({ row }) => {
			const formatter = new Intl.NumberFormat("cs", {
				style: "currency",
				currency: "CZK",
			});

			const amountCellSnippet = createRawSnippet<[string]>((getAmount) => {
				const amount = getAmount();
				return {
					render: () => `<div class="text-right font-medium">${amount}</div>`,
				};
			});

			return renderSnippet(
				amountCellSnippet,
				formatter.format(parseFloat(row.getValue("price")))
			);
		},
	},

	{
		id: "actions",
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, {
				id: row.original.id.toString(),
				entityType: 'user',
				deleteFunction: function (id: string): Promise<void> {
					throw new Error('Function not implemented.');
				}
			});
		},
		enableSorting: false,
		enableHiding: false,
	}

];