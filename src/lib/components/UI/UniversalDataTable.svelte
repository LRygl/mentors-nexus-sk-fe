<!-- src/lib/components/UI/UniversalDataTable.svelte - Fixed Version -->
<script generics="T extends Record<string, any>" lang="ts">
	import { Check, Download, Plus, AlertCircle, Filter, RefreshCw, Search, FileText } from 'lucide-svelte';
	import ActionDropdown from '$lib/components/UI/ActionDropdown.svelte';
	import type { TableColumn, TableConfig, TableCallbacks } from '$lib/types/ui/table';
	import type { ActionGroup } from '$lib/types';
	import InlineActionButtons from '$lib/components/UI/InlineActionButtons.svelte';

	//FIXME Checking the checkbox in the header does not check all checkboxes in the table page
	//FIXME Bulk Edit and Delete Selected should have propper formatting
	//FIXME

	// Fixed Props interface - remove the generic parameter from the interface itself
	interface Props {
		data: T[];
		loading?: boolean;
		error?: string | null;
		config: TableConfig<T>;
		columns: TableColumn<T>[];
		searchable?: boolean;
		filterable?: boolean;
		selectable?: boolean;
		exportable?: boolean;
		callbacks?: TableCallbacks<T>;
		selectedItems?: Set<string>;
		getActions?: (item: T) => ActionGroup[];
		emptyTitle?: string;
		emptyDescription?: string;
		emptyActionLabel?: string;
		searchPlaceholder?: string;
		className?: string;
	}

	let {
		data = $bindable(),
		loading = false,
		error = null,
		config,
		columns,
		searchable = true,
		filterable = false,
		selectable = true,
		exportable = false,
		callbacks = {},
		selectedItems = $bindable(new Set<string>()),
		getActions,
		emptyTitle = 'No Data Available',
		emptyDescription = 'Get started by creating your first item.',
		emptyActionLabel = 'Create Item',
		searchPlaceholder = 'Search items...',
		className = ''
	}: Props = $props();

	// Internal state
	let searchQuery = $state('');
	let openDropdownId = $state<string | null>(null);


	// Add this helper function
	function getItemTitle(item: T): string {
		if (config.titleField && config.titleField in item) {
			const titleValue = item[config.titleField as keyof T];
			if (titleValue !== undefined && titleValue !== null) {
				return String(titleValue);
			}
		}
		return String(item[config.idField] || 'Item');
	}

	// Filtered data based on search - fixed type assertion with debug
	let filteredData = $derived.by(() => {
		if (!searchQuery.trim()) {
			return data;
		}

		const filtered = data.filter((item) => {
			return columns.some(column => {
				if (!column.searchable) return false;
				const value = column.accessor ? column.accessor(item) : getNestedValue(item, String(column.key));
				return String(value || '').toLowerCase().includes(searchQuery.toLowerCase());
			});
		});

		return filtered;
	});

	// Selection state helpers with debug - fix function call issue
	const hasData = $derived(filteredData.length > 0);
	const hasOriginalData = $derived(data.length > 0);
	const isAllSelected = $derived(hasData && selectedItems.size === data.length);
	const isPartiallySelected = $derived(selectedItems.size > 0 && selectedItems.size < data.length);

	// Selection functions
	function toggleSelectAll() {
		if (isAllSelected) {
			selectedItems = new Set();
		} else {
			selectedItems = new Set(data.map(item => String(item[config.idField])));
		}
		callbacks.onSelectionChange?.(Array.from(selectedItems));
	}

	function toggleSelectItem(itemId: string) {
		const newSelection = new Set(selectedItems);
		if (newSelection.has(itemId)) {
			newSelection.delete(itemId);
		} else {
			newSelection.add(itemId);
		}
		selectedItems = newSelection;
		callbacks.onSelectionChange?.(Array.from(selectedItems));
	}


	// Action handlers
	async function handleAction(event: { actionId: string; itemId: string }) {
		const { actionId, itemId } = event;
		const item = data.find((i: T) => String(i[config.idField]) === itemId);
		if (!item) return;

		await callbacks.onAction?.(actionId, item);
	}

	// Row click handler - fix event parameter
	function handleRowClick(event: Event, item: T) {
		const target = event.target as HTMLElement;
		if (
			target.tagName === 'INPUT' ||
			target.tagName === 'BUTTON' ||
			target.closest('button') ||
			target.closest('input') ||
			target.closest('label')
		) {
			return;
		}
		callbacks.onRowClick?.(item);
	}

	// Dropdown handlers
	function handleDropdownOpen(event: { itemId: string }) {
		openDropdownId = event.itemId;
	}

	function handleDropdownClose(event: { itemId: string }) {
		if (openDropdownId === event.itemId) {
			openDropdownId = null;
		}
	}

	// Cell rendering based on renderType - fixed variable scoping and type safety
	function renderCell(column: TableColumn<T>, item: T, value: any): string {

		// Custome render function for column data is provided, use it
		if (column.renderCustom) {
			return column.renderCustom(item);
		}

		if (!column.renderType || column.renderType === 'text') {
			return String(value || '');
		}

		switch (column.renderType) {
			case 'badge':
				const colorMap = column.renderOptions?.colorMap || {};
				const status = String(value).toLowerCase();
				const defaultColors: Record<string, string> = {
					active: 'bg-green-100 text-green-800',
					inactive: 'bg-red-100 text-red-800',
					pending: 'bg-yellow-100 text-yellow-800',
					draft: 'bg-gray-100 text-gray-800'
				};
				const badgeColor = colorMap[status] || defaultColors[status] || 'bg-slate-100 text-slate-700';
				return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200 ${badgeColor}">${value}</span>`;

			case 'count':
				const count = Number(value) || 0;
				const {
					singular,
					plural,
					showZero = true,
					color: countColor = 'bg-slate-100 text-slate-700'
				} = column.renderOptions || {};
				if (!showZero && count === 0) {
					return '<span class="text-slate-400 text-xs">None</span>';
				}
				const label = count === 1 ? singular : plural;
				return `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-slate-200 ${countColor}">${count} ${label}</span>`;

			case 'date':
				const date = new Date(value);
				const { format = 'short' } = column.renderOptions || {};
				switch (format) {
					case 'relative':
						return formatRelativeTime(date);
					case 'long':
						return date.toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						});
					default:
						return date.toLocaleDateString();
				}

			default:
				return String(value || '');
		}
	}

	function formatRelativeTime(date: Date): string {
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) return 'Just now';
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
		if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

		return date.toLocaleDateString();
	}

	function getNestedValue(obj: any, path: string): any {
		return path.split('.').reduce((current, key) => {
			return current && current[key] !== undefined ? current[key] : undefined;
		}, obj);
	}
</script>

<!-- Main Container -->
<div class={`bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 ${className}`}>
	<!-- Search and Action Bar -->
	{#if hasOriginalData || searchQuery}
		<div class="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
			<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

				<!-- Search Section -->
				{#if searchable}
					<div class="flex flex-1 items-center gap-3">
						<div class="relative max-w-md flex-1">
							<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
							<input
								type="text"
								placeholder={searchPlaceholder}
								bind:value={searchQuery}
								class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
							/>
						</div>
						{#if filterable}
							<button
								class="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-200">
								<Filter class="h-4 w-4 text-slate-600" />
							</button>
						{/if}
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="flex items-center gap-3">
					{#if exportable && hasOriginalData}
						<button
							class="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium"
							onclick={() => callbacks.onExport?.(data)}
						>
							<Download class="w-4 h-4" />
							Export
						</button>
					{/if}

					{#if callbacks.onCreate}
						<button
							class="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
							onclick={() => callbacks.onCreate?.()}
							disabled={loading}
						>
							<Plus class="w-4 h-4" />
							{config.createButtonLabel || 'Create'}
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	{#if loading}
		<!-- Loading State -->
		<div class="flex flex-col items-center justify-center py-16">
			<div class="relative">
				<div class="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
			</div>
			<h3 class="mt-4 text-lg font-semibold text-slate-700">{config.loadingTitle || 'Loading'}</h3>
			<p
				class="mt-1 text-sm text-slate-500">{config.loadingDescription || 'Please wait while we fetch your data...'}</p>
		</div>

	{:else if error}
		<!-- Error State -->
		<div class="flex flex-col items-center justify-center py-16 px-6">
			<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
				<AlertCircle class="w-8 h-8 text-red-600" />
			</div>
			<h3 class="text-xl font-semibold text-slate-900 mb-2">Something went wrong</h3>
			<p class="text-slate-600 text-center mb-6 max-w-md">{error}</p>
			<div class="flex gap-3">
				{#if callbacks.onRefresh}
					<button
						onclick={() => callbacks.onRefresh?.()}
						class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
					>
						<RefreshCw class="w-4 h-4" />
						Try Again
					</button>
				{/if}
				{#if callbacks.onCreate}
					<button
						onclick={() => callbacks.onCreate?.()}
						class="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium"
					>
						<Plus class="w-4 h-4" />
						{emptyActionLabel}
					</button>
				{/if}
			</div>
		</div>

	{:else if !hasOriginalData}
		<!-- Empty State -->
		<div class="flex flex-col items-center justify-center py-20 px-6">
			<div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
				<FileText class="w-10 h-10 text-indigo-600" />
			</div>
			<h3 class="text-2xl font-semibold text-slate-900 mb-3">{emptyTitle}</h3>
			<p class="text-slate-600 text-center mb-8 max-w-md leading-relaxed">{emptyDescription}</p>
			{#if callbacks.onCreate}
				<button
					onclick={() => callbacks.onCreate?.()}
					class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
				>
					<Plus class="w-5 h-5" />
					{emptyActionLabel}
				</button>
			{/if}
		</div>

	{:else if !hasData && searchQuery}
		<!-- No Search Results -->
		<div class="flex flex-col items-center justify-center py-16 px-6">
			<div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
				<Search class="w-8 h-8 text-slate-400" />
			</div>
			<h3 class="text-lg font-semibold text-slate-900 mb-2">No results found</h3>
			<p class="text-slate-600 text-center mb-6">
				We couldn't find any items matching "<span class="font-medium">{searchQuery}</span>". Try adjusting your search
				terms.
			</p>
			<button
				onclick={() => searchQuery = ''}
				class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium"
			>
				Clear Search
			</button>
		</div>

	{:else}
		<!-- Data Table -->
		<div class="table-wrapper overflow-x-auto" class:dropdown-open={openDropdownId !== null}>
			<table class="w-full">
				<thead class="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
				<tr>
					{#if selectable}
						<th class="w-12 px-6 py-4">
							<label class="flex items-center cursor-pointer">
								<input
									type="checkbox"
									class="sr-only"
									checked={isAllSelected}
									indeterminate={isPartiallySelected}
									onchange={toggleSelectAll}
								/>
								<div class={`
										w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200
										${isAllSelected || isPartiallySelected
											? 'bg-indigo-600 border-indigo-600'
											: 'border-slate-300 hover:border-indigo-400'
										}
									`}>
									{#if isAllSelected}
										<Check class="h-3 w-3 text-white" />
									{:else if isPartiallySelected}
										<div class="w-2 h-2 bg-white rounded-sm"></div>
									{/if}
								</div>
							</label>
						</th>
					{/if}

					{#each columns as column}
						<th
							class={`px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${column.headerClassName || ''}`}>
							{column.header}
						</th>
					{/each}

					{#if getActions}
						<th class="pr-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
							Actions
						</th>
					{/if}
				</tr>
				</thead>
				<tbody class="divide-y divide-slate-100">
				{#each filteredData as item, index (item[config.idField])}
					<tr
						class={`hover:bg-slate-50/50 transition-all duration-200 group cursor-pointer
									${selectedItems.has(String(item[config.idField])) ? 'bg-indigo-50/50' : ''}
									hover:shadow-sm hover:scale-[1.002] transform-gpu
						`}
						onclick={(e) => handleRowClick(e, item)}
						role="button"
						tabindex="0"
						onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				handleRowClick(e, item);
			}
		}}
					>
						{#if selectable}
							<td class="px-6 py-4">
								<label class="flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={selectedItems.has(String(item[config.idField]))}
										onchange={() => toggleSelectItem(String(item[config.idField]))}
										onclick={(event) => event.stopPropagation()}
										class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2"
									/>
								</label>
							</td>
						{/if}

						{#each columns as column}
							<td class={`px-6 py-4 ${column.cellClassName || ''}`}>
								{#if column.renderType === 'custom'}
									{@html renderCell(column, item, column.accessor ? column.accessor(item) : getNestedValue(item, String(column.key)))}
								{:else}
									{@html renderCell(column, item, column.accessor ? column.accessor(item) : getNestedValue(item, String(column.key)))}
								{/if}
							</td>
						{/each}
						{#if getActions}
							<td class="px-6 py-4 table-cell-with-dropdown">
								{#if config.actionsInline}
									<InlineActionButtons
										itemId={String(item[config.idField])}
										itemTitle={String(item[config.titleField])}
										actions={getActions(item)}
										onAction={handleAction}
										maxVisible={3}
									/>
								{:else}
									<div onclick={(e) => e.stopPropagation()} role="none">
										<ActionDropdown
											itemId={String(item[config.idField])}
											itemTitle={String(item[config.titleField])}
											actions={getActions(item)}
											buttonVariant="outline"
											buttonSize="sm"
											dropdownWidth="w-64"
											position="right"
											isOpen={openDropdownId === String(item[config.idField])}
											onaction={handleAction}
											onopen={handleDropdownOpen}
											onclose={handleDropdownClose}
										/>
									</div>
								{/if}
							</td>

						{/if}
					</tr>
				{/each}
				</tbody>
			</table>
		</div>

		<!-- Table Footer with Selection Info -->
		{#if selectable && selectedItems.size > 0}
			<div class="px-6 py-4 bg-slate-50 border-t border-slate-200">
				<div class="flex items-center justify-between">
					<p class="text-sm text-slate-600">
						{selectedItems.size} of {filteredData.length} items selected
					</p>
					<div class="flex gap-2">
						{#if callbacks.onBulkEdit}
							<button
								class="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 transition-colors"
								onclick={() => callbacks.onBulkEdit?.(Array.from(selectedItems))}
							>
								Bulk Edit
							</button>
						{/if}
						{#if callbacks.onBulkDelete}
							<button
								class="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 transition-colors"
								onclick={() => callbacks.onBulkDelete?.(Array.from(selectedItems))}
							>
								Delete Selected
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>