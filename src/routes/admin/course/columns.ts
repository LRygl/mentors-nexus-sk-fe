import { renderSnippet } from '$lib/components/ui/data-table';
import { createRawSnippet } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent} from '$lib/components/ui/data-table';
import DataTableActions from '$lib/components/data-table-actions.svelte'
import type { Course } from '$lib/types/course';

export const columns: ColumnDef<Course>[] = [
	{
		accessorKey: "id",
		header: "Id",
	},
	{
		accessorKey: "name",
		header: "Název",
	},
	{
		accessorKey: "status",
		header: "Status",
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

	//Amount column has special extension - as i can have a separate columns definition for each table taht is passed to data
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
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}

];