<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		getCoreRowModel,
		getPaginationRowModel,
		type PaginationState,
		type RowSelectionState,
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table';
	import { Button } from '$lib/components/ui/button/index';
	import * as Table from "$lib/components/ui/table"
	import { Loader2Icon, MoreHorizontal } from 'lucide-svelte';
	import { CirclePlus, EyeOff, LoaderCircle, RefreshCw } from 'lucide-svelte';
	import { t } from '$lib/stores/internalization-store';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		loading?: boolean;
		loadTableData?: () => Promise<void>;
	}

	let { data, columns, loading = false, loadTableData }: DataTableProps<TData, TValue> = $props();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10})
	let rowSelection = $state<RowSelectionState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		onRowSelectionChange: (updater) => {
			if (typeof updater === "function") {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get rowSelection() {
				return rowSelection;
			},
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});
</script>

<div>
	<div class="flex justify-end mb-2">
		<div class="inline-flex rounded-md shadow-sm" role="group">
			<Button
				onclick={loadTableData}
				variant="outline"
				class="rounded-r-none border-r-0"
			>
				{#if loading}
					<LoaderCircle class="w-4 h-4 animate-spin" />
				{:else}
					<RefreshCw class="w-4 h-4" />
				{/if}
			</Button>
			<Button
				variant="outline"
				class="rounded-none border-r-0"
			>
				<MoreHorizontal class="w-4 h-4" />
			</Button>
			<Button
				onclick={loadTableData}
				variant="outline"
				class="rounded-l-none"
			>
				<CirclePlus />{$t.buttons.create}
			</Button>
		</div>
	</div>
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row >
						{#each headerGroup.headers as header (header.id)}
							<Table.Head colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#if loading && data.length === 0}
					<!-- Show loading skeleton when initially loading -->
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-32 text-center">
							<div class="flex items-center justify-center">
								<Loader2Icon class="w-6 h-6 animate-spin mr-2" />
								<span>
									{$t.loading.default}
								</span>
							</div>
						</Table.Cell>
					</Table.Row>
				{:else if loading && data.length > 0}
					<!-- Show data with loading overlay when refreshing -->
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row data-state={row.getIsSelected() && "selected"} class="opacity-60">
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell>
									<FlexRender
										content={cell.column.columnDef.cell}
										context={cell.getContext()}
									/>
								</Table.Cell>
							{/each}
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center text-muted">
								{$t.errors.not_found}
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<!-- Normal data display -->
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row data-state={row.getIsSelected() && "selected"}>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell>
									<FlexRender
										content={cell.column.columnDef.cell}
										context={cell.getContext()}
									/>
								</Table.Cell>
							{/each}
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center">
								<!-- TODO ADD ICON AND SOME BLING -->
								{$t.errors.not_found}
							</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	{#if loading && data.length > 0}
		<!-- Loading indicator overlay for refresh -->
		<div class="relative -mt-1">
			<div class="absolute inset-0 bg-background/50 rounded-b-md flex items-start justify-center pt-2">
				<div class="bg-background border rounded-md px-3 py-1 shadow-sm">
					<div class="flex items-center text-sm text-muted-foreground">
						<Loader2Icon class="w-4 h-4 animate-spin mr-2" />
						Refreshing...
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="flex flex-row justify-between">
		<div class="space-x-2 py-4">
			<!-- COMBOBOX FOR PAGINATION -->
			PAGINATION
		</div>
		<div class="flex items-center justify-end space-x-2 py-4">
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage() || loading}
			>
				{$t.common.previous}
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage() || loading}
			>
				{$t.common.next}
			</Button>
		</div>
	</div>
</div>