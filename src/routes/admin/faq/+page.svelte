<!-- src/routes/admin/faq/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { faqStore } from '$lib/stores/defaults/faqStore.svelte';
	import { FAQStatus, FAQPriority, getFAQStatusLabel, getFAQPriorityLabel } from '$lib/types';
	import { formatDateTime } from '$lib/utils/dateTimeFormat'

	// Icons
	import AntDesignProfileOutlined from '~icons/ant-design/profile-outlined';
	import AntDesignSearchOutlined from '~icons/ant-design/search-outlined';
	import AntDesignReloadOutlined from '~icons/ant-design/reload-outlined';

	// Local search input state
	let searchInput = $state('');
	let statusFilter = $state('');
	let priorityFilter = $state('');

	// Load FAQs on component mount
	onMount(async () => {
		console.log('FAQ Admin Page: Loading initial data...');
		await faqStore.loadFAQs();
	});

	// Handle search
	async function handleSearch() {
		console.log('FAQ Admin Page: Performing search with:', searchInput);
		await faqStore.setSearch(searchInput);
	}

	// Handle status filter change
	async function handleStatusFilter() {
		const status = statusFilter === '' ? undefined : statusFilter as FAQStatus;
		console.log('FAQ Admin Page: Setting status filter to:', status);
		await faqStore.setStatus(status);
	}

	// Handle priority filter change
	async function handlePriorityFilter() {
		const priority = priorityFilter === '' ? undefined : priorityFilter as FAQPriority;
		console.log('FAQ Admin Page: Setting priority filter to:', priority);
		await faqStore.setPriority(priority);
	}

	// Handle pagination
	async function handlePageChange(page: number) {
		console.log('FAQ Admin Page: Changing to page:', page);
		await faqStore.gotoPage(page);
	}

	async function handlePageSizeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const size = parseInt(target.value);
		console.log('FAQ Admin Page: Changing page size to:', size);
		await faqStore.changePageSize(size);
	}

	// Clear search
	async function clearSearch() {
		searchInput = '';
		await faqStore.clearSearch();
	}

	// Reset all filters
	async function resetAllFilters() {
		searchInput = '';
		statusFilter = '';
		priorityFilter = '';
		await faqStore.resetFilters();
	}

	// Refresh data
	async function refreshData() {
		console.log('FAQ Admin Page: Refreshing data...');
		await faqStore.refresh();
	}

	// Utility functions for styling using your existing helper functions
	function getStatusBadgeClass(status: FAQStatus): string {
		switch (status) {
			case FAQStatus.PUBLISHED:
				return 'bg-nexus-success text-nexus-success-text';
			case FAQStatus.DRAFT:
				return 'bg-nexus-warning text-nexus-warning-text';
			case FAQStatus.ARCHIVED:
				return 'bg-nexus-dark-100 text-nexus-primary-800';
			default:
				return 'bg-nexus-none text-nexus-primary-800';
		}
	}

	function getPriorityBadgeClass(priority: FAQPriority): string {
		switch (priority) {
			case FAQPriority.URGENT:
				return 'bg-nexus-danger text-white';
			case FAQPriority.HIGH:
				return 'bg-nexus-warning text-nexus-warning-text';
			case FAQPriority.NORMAL:
				return 'bg-nexus-info text-nexus-info-text';
			case FAQPriority.LOW:
				return 'bg-nexus-success text-nexus-success-text';
			default:
				return 'bg-nexus-none text-nexus-primary-800';
		}
	}
</script>

<div class="p-6">
	<!-- Header -->
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-4xl font-bold text-nexus-primary">FAQ Management</h1>
		<button
			onclick={refreshData}
			class="btn-primary flex items-center gap-2"
			disabled={faqStore.loading}
		>
			<AntDesignReloadOutlined class={faqStore.loading ? 'animate-spin' : ''} />
			Refresh
		</button>
	</div>

	<!-- Filters and Search -->
	<div class="bg-white rounded-lg shadow p-4 mb-6">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<!-- Search -->
			<div class="relative">
				<input
					type="text"
					bind:value={searchInput}
					placeholder="Search FAQs..."
					class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-nexus-primary focus:border-nexus-primary"
					onkeydown={(e) => e.key === 'Enter' && handleSearch()}
				/>
				<AntDesignSearchOutlined class="absolute left-3 top-2.5 text-gray-400" />
			</div>

			<!-- Status Filter -->
			<select
				bind:value={statusFilter}
				onchange={handleStatusFilter}
				class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-nexus-primary focus:border-nexus-primary"
			>
				<option value="">All Statuses</option>
				{#each Object.values(FAQStatus) as status}
					<option value={status}>{getFAQStatusLabel(status)}</option>
				{/each}
			</select>

			<!-- Priority Filter -->
			<select
				bind:value={priorityFilter}
				onchange={handlePriorityFilter}
				class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-nexus-primary focus:border-nexus-primary"
			>
				<option value="">All Priorities</option>
				{#each Object.values(FAQPriority) as priority}
					<option value={priority}>{getFAQPriorityLabel(priority)}</option>
				{/each}
			</select>

			<!-- Actions -->
			<div class="flex gap-2">
				<button
					onclick={handleSearch}
					class="px-4 py-2 bg-nexus-primary text-white rounded-lg hover:bg-nexus-primary-600 transition-colors"
					disabled={faqStore.loading}
				>
					Search
				</button>
				<button
					onclick={resetAllFilters}
					class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
					disabled={faqStore.loading}
				>
					Reset
				</button>
			</div>
		</div>
	</div>

	<!-- Error Display -->
	{#if faqStore.error}
		<div class="bg-nexus-warning text-nexus-warning-text p-4 rounded-lg mb-4">
			<p><strong>Error:</strong> {faqStore.error}</p>
		</div>
	{/if}

	<!-- Loading State -->
	{#if faqStore.loading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-nexus-primary"></div>
			<span class="ml-3 text-nexus-primary">Loading FAQs...</span>
		</div>
	{/if}

	<!-- FAQ Table -->
	{#if !faqStore.isEmpty && !faqStore.loading}
		<div class="bg-white rounded-lg shadow overflow-hidden">
			<!-- Results Summary -->
			<div class="px-6 py-3 bg-gray-50 border-b">
				<p class="text-sm text-gray-600">
					Showing {faqStore.currentPage * faqStore.pageSize + 1} to
					{Math.min((faqStore.currentPage + 1) * faqStore.pageSize, faqStore.totalElements)}
					of {faqStore.totalElements} results
				</p>
			</div>

			<!-- Table -->
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-nexus-primary-800">
					<thead class="text-xs uppercase bg-nexus-primary text-white">
					<tr>
						<th class="px-6 py-3">Question</th>
						<th class="px-6 py-3">Status</th>
						<th class="px-6 py-3">Priority</th>
						<th class="px-6 py-3">Category</th>
						<th class="px-6 py-3">Views</th>
						<th class="px-6 py-3">Created</th>
						<th class="px-6 py-3">Actions</th>
					</tr>
					</thead>
					<tbody>
					{#each faqStore.data as faq (faq.uuid)}
						<tr class="bg-white border-b hover:bg-gray-50">
							<td class="px-6 py-4">
								<div class="max-w-xs">
									<p class="font-medium truncate">{faq.question}</p>
									<p class="text-xs text-gray-500 mt-1">UUID: {faq.uuid}</p>
								</div>
							</td>
							<td class="px-6 py-4">
									<span class="px-2 py-1 text-xs rounded-full {getStatusBadgeClass(faq.status)}">
										{getFAQStatusLabel(faq.status)}
									</span>
							</td>
							<td class="px-6 py-4">
									<span class="px-2 py-1 text-xs rounded-full {getPriorityBadgeClass(faq.priority)}">
										{getFAQPriorityLabel(faq.priority)}
									</span>
							</td>
							<td class="px-6 py-4">
								{faq.category?.name || '-'}
							</td>
							<td class="px-6 py-4">
								{faq.viewCount.toLocaleString()}
							</td>
							<td class="px-6 py-4">
								<div class="text-sm">
									{formatDateTime(faq.createdAt)}
								</div>
							</td>
							<td class="px-6 py-4">
								<button
									class="group inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
									title="View FAQ Details"
								>
									<AntDesignProfileOutlined class="group-hover:text-nexus-secondary" />
								</button>
							</td>
						</tr>
					{/each}
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			{#if faqStore.totalPages > 1}
				<div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
					<!-- Page Size Selector -->
					<div class="flex items-center">
						<label for="pageSize" class="text-sm text-gray-700 mr-2">Show:</label>
						<select
							id="pageSize"
							value={faqStore.pageSize}
							onchange={handlePageSizeChange}
							class="px-2 py-1 border border-gray-300 rounded text-sm"
						>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</select>
						<span class="text-sm text-gray-700 ml-2">per page</span>
					</div>

					<!-- Page Navigation -->
					<div class="flex items-center space-x-2">
						<button
							onclick={() => handlePageChange(faqStore.currentPage - 1)}
							disabled={!faqStore.hasPreviousPage}
							class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Previous
						</button>

						<!-- Page Numbers -->
						{#each Array(Math.min(faqStore.totalPages, 5)) as _, i}
							{@const pageNum = faqStore.currentPage <= 2 ? i : faqStore.currentPage - 2 + i}
							{#if pageNum < faqStore.totalPages}
								<button
									onclick={() => handlePageChange(pageNum)}
									class="px-3 py-1 border rounded text-sm {pageNum === faqStore.currentPage ? 'bg-nexus-primary text-white border-nexus-primary' : 'border-gray-300 hover:bg-gray-50'}"
								>
									{pageNum + 1}
								</button>
							{/if}
						{/each}

						<button
							onclick={() => handlePageChange(faqStore.currentPage + 1)}
							disabled={!faqStore.hasNextPage}
							class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Next
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Empty State -->
	{#if faqStore.isEmpty && !faqStore.loading}
		<div class="bg-white rounded-lg shadow p-12 text-center">
			<div class="max-w-md mx-auto">
				<h3 class="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
				<p class="text-gray-500 mb-4">
					{#if faqStore.currentSearch || faqStore.currentStatus || faqStore.currentPriority}
						No FAQs match your current filters. Try adjusting your search criteria.
					{:else}
						There are no FAQs in the system yet.
					{/if}
				</p>
				{#if faqStore.currentSearch || faqStore.currentStatus || faqStore.currentPriority}
					<button
						onclick={resetAllFilters}
						class="btn-primary"
					>
						Clear Filters
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>