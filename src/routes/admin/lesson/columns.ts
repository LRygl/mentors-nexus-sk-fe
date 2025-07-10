import type { Lesson } from '$lib/types/lesson';
import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import DataTableActions from '$lib/components/DataTable/DataTableActions/data-table-actions.svelte';
import { Checkbox } from '$lib/components/ui/checkbox';
import id = $props.id;
import { createRawSnippet } from 'svelte';
import { formatDuration } from '$lib/utils/duration-utils';

export const columns: ColumnDef<Lesson>[] = [
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
		accessorKey: "title",
		header: "Lesson",
		cell: ({ row }) => {
			const lesson = row.original;

			const lessonCellSnippet = createRawSnippet<[Lesson]>((getLesson) => {
				const lessonData = getLesson();

				if (!lessonData) {
					return {
						render: () => `<div class="text-gray-500">No lesson data</div>`
					};
				}

				const titleText = lessonData.title ?? 'Untitled';
				const descText = lessonData.description ?? '';

				return {
					render: () => `
       <a 
             class="flex items-start gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors text-left w-full"
             href="/admin/lesson/${lessonData.id}"
           >
					 	<div class="w-40 aspect-[4/3] overflow-hidden rounded-md shadow">
							<img src="/thumbnail.jpg" class="w-full h-full object-cover" alt="Thumbnail">
						</div>
             
             <div class="flex flex-col">
               <span class="text-xl font-medium">${titleText}</span>
               ${descText ? `<span class="text-sm text-gray-500">${descText}</span>` : ''}
             </div>
           </a>
      `
				};
			});

			return renderSnippet(lessonCellSnippet, lesson);
		}
	},

	{
		accessorKey: "uuid",
		header: "UUID",
	},
	{
		accessorKey: "duration",
		header: "Duration",
		cell: ({ row }) => {
			const duration = row.getValue("duration");

			const durationCellSnippet = createRawSnippet<[unknown]>((getDuration) => {
				const durationData = getDuration() as string | null;
				const formattedDuration = formatDuration(durationData);

				return {
					render: () => `
       <div class="flex items-center gap-2 text-sm font-medium text-gray-900">
         <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <circle cx="12" cy="12" r="10"></circle>
           <polyline points="12,6 12,12 16,14"></polyline>
         </svg>
         ${formattedDuration}
       </div>
      `
				};
			});

			return renderSnippet(durationCellSnippet, duration);
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
]