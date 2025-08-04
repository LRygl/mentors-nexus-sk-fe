<!-- src/routes/admin/faq/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { faqStore } from '$lib/stores/defaults/faqStore.svelte';
	import { FAQStatus, FAQPriority, getFAQStatusLabel, getFAQPriorityLabel } from '$lib/types';
	import { formatDateTime } from '$lib/utils/dateTimeFormat';

	// Lucide Icons
	import {
		Search, RotateCcw, Eye, Plus, MoreHorizontal, Filter, X, ChevronDown,
		TrendingUp, Users, Clock, AlertCircle, CheckCircle, Archive,
		Star, MessageSquare, BarChart3, Calendar, Settings, Download,
		Grid3X3, List, SortAsc, SortDesc, Bookmark, Tag
	} from 'lucide-svelte';

	// Import the Analytics Dashboard component

	// Import custom checkbox component
	import CustomCheckbox from '$lib/components/ui/CustomCheckbox.svelte';
	import AnalyticsCard from '$lib/components/Analytics/AnalyticsCard.svelte';

	// View State
	let viewMode = $state<'grid' | 'list'>('list');
	let sortBy = $state<'created' | 'views' | 'priority' | 'updated'>('created');
	let sortOrder = $state<'asc' | 'desc'>('desc');
	let selectedFAQs = $state<Set<string>>(new Set());
	let showFilters = $state(false);
	let selectedCategory = $state('');

	// Filters
	let searchInput = $state('');
	let statusFilter = $state('');
	let priorityFilter = $state('');
	let dateRange = $state('');

	// Bulk actions
	let showBulkActions = $state(true);

	// Derived states
	const hasActiveFilters = $derived(searchInput || statusFilter || priorityFilter || dateRange || selectedCategory);
	const hasSelectedFAQs = $derived(selectedFAQs.size > 0);
	const isAllSelected = $derived(faqStore.data.length > 0 && selectedFAQs.size === faqStore.data.length);
	const isPartiallySelected = $derived(selectedFAQs.size > 0 && selectedFAQs.size < faqStore.data.length);

	// Mock analytics data
	const analytics = {
		totalFAQs: 247,
		publishedFAQs: 198,
		draftFAQs: 32,
		archivedFAQs: 17,
		totalViews: 15420,
		avgViews: 62,
		todayViews: 342,
		topCategories: ['Product', 'Billing', 'Support', 'Technical'],
		recentActivity: [
			{ action: 'Created', item: 'How to reset password?', time: '2 hours ago' },
			{ action: 'Updated', item: 'Billing FAQ updated', time: '4 hours ago' },
			{ action: 'Published', item: 'New product features', time: '6 hours ago' }
		]
	};

	// Load data
	onMount(async () => {
		await faqStore.loadFAQs();
	});

	// Actions
	async function handleSearch() {
		await faqStore.setSearch(searchInput);
	}

	async function handleSort(field: typeof sortBy) {
		if (sortBy === field) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = field;
			sortOrder = 'desc';
		}
		// Apply sorting logic here
	}

	async function handleStatusFilter() {
		const status = statusFilter === '' ? undefined : statusFilter as FAQStatus;
		await faqStore.setStatus(status);
	}

	async function handlePriorityFilter() {
		const priority = priorityFilter === '' ? undefined : priorityFilter as FAQPriority;
		await faqStore.setPriority(priority);
	}

	async function handlePageChange(page: number) {
		await faqStore.gotoPage(page);
	}

	async function handlePageSizeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const size = parseInt(target.value);
		await faqStore.changePageSize(size);
	}

	async function resetAllFilters() {
		searchInput = '';
		statusFilter = '';
		priorityFilter = '';
		dateRange = '';
		selectedCategory = '';
		await faqStore.resetFilters();
	}

	async function refreshData() {
		await faqStore.refresh();
	}

	// Selection handlers
	function toggleSelectAll() {
		if (isAllSelected) {
			selectedFAQs.clear();
		} else {
			selectedFAQs = new Set(faqStore.data.map(faq => faq.uuid));
		}
	}

	function toggleSelectFAQ(uuid: string) {
		if (selectedFAQs.has(uuid)) {
			selectedFAQs.delete(uuid);
		} else {
			selectedFAQs.add(uuid);
		}
		selectedFAQs = selectedFAQs; // Trigger reactivity
	}

	// Bulk actions
	async function bulkDelete() {
		console.log('Bulk delete:', Array.from(selectedFAQs));
		selectedFAQs.clear();
	}

	async function bulkPublish() {
		console.log('Bulk publish:', Array.from(selectedFAQs));
		selectedFAQs.clear();
	}

	async function bulkArchive() {
		console.log('Bulk archive:', Array.from(selectedFAQs));
		selectedFAQs.clear();
	}

	// Utility functions
	function getStatusColor(status: FAQStatus) {
		const colors = {
			[FAQStatus.PUBLISHED]: 'text-emerald-600 bg-emerald-50 border-emerald-200',
			[FAQStatus.DRAFT]: 'text-amber-600 bg-amber-50 border-amber-200',
			[FAQStatus.ARCHIVED]: 'text-slate-600 bg-slate-50 border-slate-200'
		};
		return colors[status] || 'text-slate-600 bg-slate-50 border-slate-200';
	}

	function getPriorityColor(priority: FAQPriority) {
		const colors = {
			[FAQPriority.URGENT]: 'text-red-600 bg-red-50 border-red-200',
			[FAQPriority.HIGH]: 'text-orange-600 bg-orange-50 border-orange-200',
			[FAQPriority.NORMAL]: 'text-blue-600 bg-blue-50 border-blue-200',
			[FAQPriority.LOW]: 'text-green-600 bg-green-50 border-green-200'
		};
		return colors[priority] || 'text-slate-600 bg-slate-50 border-slate-200';
	}

	function getStatusIcon(status: FAQStatus) {
		const icons = {
			[FAQStatus.PUBLISHED]: CheckCircle,
			[FAQStatus.DRAFT]: Clock,
			[FAQStatus.ARCHIVED]: Archive
		};
		return icons[status] || AlertCircle;
	}
</script>

<!-- Main Container -->
<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
	<div class="max-w-8xl mx-auto p-6">

		<!-- Dashboard Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between mb-6">
				<div>
					<h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						FAQ Command Center
					</h1>
					<p class="text-slate-600 mt-2">Manage, analyze, and optimize your knowledge base</p>
				</div>
				<div class="flex items-center gap-4">
					<!-- Unified Button Group - All Three Buttons -->
					<div class="inline-flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
						<button
							onclick={() => console.log('Export data')}
							class="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors border-r border-slate-200 text-sm font-medium"
						>
							<Download class="w-4 h-4" />
							Export
						</button>
						<button
							onclick={() => console.log('Settings')}
							class="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors border-r border-slate-200 text-sm font-medium"
						>
							<Settings class="w-4 h-4" />
							Settings
						</button>
						<button
							onclick={() => console.log('Create FAQ')}
							class="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
						>
							<Plus class="w-4 h-4" />
							Create FAQ
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Content Area -->
		<div class="grid grid-cols-1 gap-6">

			<!-- Main Content -->
			<div class="col-span-1">
				<AnalyticsCard/>



				<!-- Control Bar -->
				<div class="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
					<div class="p-6 border-b border-slate-200">
						<div class="flex flex-col gap-6">



							<!-- Primary Search Row -->
							<div class="flex flex-col lg:flex-row lg:items-center gap-4">

								<!-- Search Input -->
								<div class="flex-1 relative">
									<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
									<input
										type="text"
										bind:value={searchInput}
										placeholder="Search FAQs, answers, categories..."
										class="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-sm placeholder:text-slate-500 transition-all duration-200"
										onkeydown={(e) => e.key === 'Enter' && handleSearch()}
									/>
									{#if searchInput}
										<button
											onclick={() => searchInput = ''}
											class="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-md transition-colors"
										>
											<X class="w-4 h-4 text-slate-400" />
										</button>
									{/if}
								</div>

								<!-- Primary Action -->
								<button
									onclick={handleSearch}
									disabled={faqStore.loading}
									class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 font-medium text-sm min-w-[100px]"
								>
									{#if faqStore.loading}
										<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
									{:else}
										Search
									{/if}
								</button>
							</div>



							<!-- Advanced Filters Row -->
							<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

								<!-- Category Filter -->
								<div class="lg:col-span-2">
									<label class="block text-xs font-medium text-slate-700 mb-2">Category</label>
									<div class="relative">
										<select
											bind:value={selectedCategory}
											onchange={() => console.log('Category changed:', selectedCategory)}
											class="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm appearance-none transition-colors duration-200"
										>
											<option value="">All Categories</option>
											{#each analytics.topCategories as category}
												<option value={category}>{category}</option>
											{/each}
										</select>
										<ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
									</div>
								</div>

								<!-- Status Filter -->
								<div>
									<label class="block text-xs font-medium text-slate-700 mb-2">Status</label>
									<div class="relative">
										<select
											bind:value={statusFilter}
											onchange={handleStatusFilter}
											class="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm appearance-none transition-colors duration-200"
										>
											<option value="">All Status</option>
											{#each Object.values(FAQStatus) as status}
												<option value={status}>{getFAQStatusLabel(status)}</option>
											{/each}
										</select>
										<ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
									</div>
								</div>

								<!-- Priority Filter -->
								<div>
									<label class="block text-xs font-medium text-slate-700 mb-2">Priority</label>
									<div class="relative">
										<select
											bind:value={priorityFilter}
											onchange={handlePriorityFilter}
											class="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm appearance-none transition-colors duration-200"
										>
											<option value="">All Priority</option>
											{#each Object.values(FAQPriority) as priority}
												<option value={priority}>{getFAQPriorityLabel(priority)}</option>
											{/each}
										</select>
										<ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
									</div>
								</div>

								<!-- Date Range Filter -->
								<div>
									<label class="block text-xs font-medium text-slate-700 mb-2">Date Range</label>
									<div class="relative">
										<select
											bind:value={dateRange}
											class="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm appearance-none transition-colors duration-200"
										>
											<option value="">All Time</option>
											<option value="today">Today</option>
											<option value="week">This Week</option>
											<option value="month">This Month</option>
											<option value="quarter">This Quarter</option>
											<option value="year">This Year</option>
										</select>
										<ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
									</div>
								</div>

								<!-- Clear Filters & View Controls -->
								<div class="flex items-end gap-2">
									{#if hasActiveFilters}
										<button
											onclick={resetAllFilters}
											class="px-3 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium border border-slate-200"
											title="Clear all filters"
										>
											<X class="w-4 h-4" />
										</button>
									{/if}

									<!-- View Toggle -->
									<div class="inline-flex items-center border border-slate-200 rounded-xl bg-white">
										<button
											onclick={() => viewMode = 'list'}
											class="p-2.5 rounded-l-xl transition-colors {viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}"
											title="List View"
										>
											<List class="w-4 h-4" />
										</button>
										<button
											onclick={() => viewMode = 'grid'}
											class="p-2.5 rounded-r-xl transition-colors {viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}"
											title="Grid View"
										>
											<Grid3X3 class="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>

							<!-- Sort & Pagination Controls -->
							<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-200">

								<!-- Sort Controls -->
								<div class="flex items-center gap-4">
									<div class="flex items-center gap-2">
										<label class="text-xs font-medium text-slate-700">Sort by:</label>
										<select
											bind:value={sortBy}
											onchange={() => handleSort(sortBy)}
											class="px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
										>
											<option value="created">Date Created</option>
											<option value="views">View Count</option>
											<option value="priority">Priority</option>
											<option value="updated">Last Updated</option>
										</select>

										<button
											onclick={() => sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'}
											class="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
											title="Toggle sort order"
										>
											{#if sortOrder === 'asc'}
												<SortAsc class="w-4 h-4 text-slate-600" />
											{:else}
												<SortDesc class="w-4 h-4 text-slate-600" />
											{/if}
										</button>
									</div>

									<div class="hidden sm:block w-px h-6 bg-slate-300"></div>

									<!-- Results per page -->
									<div class="flex items-center gap-2">
										<label class="text-xs font-medium text-slate-700">Show:</label>
										<select
											value={faqStore.pageSize}
											onchange={handlePageSizeChange}
											class="px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
										>
											<option value="10">10</option>
											<option value="20">20</option>
											<option value="50">50</option>
											<option value="100">100</option>
										</select>
									</div>
								</div>

								<!-- Action Controls -->
								<div class="flex items-center gap-3">
									<button
										onclick={refreshData}
										disabled={faqStore.loading}
										class="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
										title="Refresh data"
									>
										<RotateCcw class="w-4 h-4 {faqStore.loading ? 'animate-spin' : ''} text-slate-600" />
									</button>

									<div class="w-px h-6 bg-slate-300"></div>

									<!-- Bulk Actions Trigger -->
									{#if hasSelectedFAQs}
										<button
											onclick={() => showBulkActions = !showBulkActions}
											class="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors text-sm font-medium"
										>
											{selectedFAQs.size} selected
										</button>
									{/if}
								</div>
							</div>
						</div>

						<!-- Active Filters Display -->
						{#if hasActiveFilters}
							<div class="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200">
								<span class="text-xs font-medium text-slate-600">Active filters:</span>
								<div class="flex items-center gap-2 flex-wrap">
									{#if searchInput}
										<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-medium border border-indigo-200">
											<Search class="w-3 h-3" />
											{searchInput}
											<button onclick={() => searchInput = ''} class="hover:bg-indigo-200 rounded p-0.5 transition-colors">
												<X class="w-3 h-3" />
											</button>
										</span>
									{/if}
									{#if selectedCategory}
										<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200">
											<Tag class="w-3 h-3" />
											{selectedCategory}
											<button onclick={() => selectedCategory = ''} class="hover:bg-emerald-200 rounded p-0.5 transition-colors">
												<X class="w-3 h-3" />
											</button>
										</span>
									{/if}
									{#if statusFilter}
										<span class="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-medium border border-purple-200">
											Status: {getFAQStatusLabel(statusFilter)}
										</span>
									{/if}
									{#if priorityFilter}
										<span class="px-2.5 py-1 bg-orange-100 text-orange-800 rounded-lg text-xs font-medium border border-orange-200">
											Priority: {getFAQPriorityLabel(priorityFilter)}
										</span>
									{/if}
									{#if dateRange}
										<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium border border-blue-200">
											<Calendar class="w-3 h-3" />
											{dateRange === 'today' ? 'Today' :
												dateRange === 'week' ? 'This Week' :
													dateRange === 'month' ? 'This Month' :
														dateRange === 'quarter' ? 'This Quarter' :
															dateRange === 'year' ? 'This Year' : dateRange}
										</span>
									{/if}
								</div>
								<button onclick={resetAllFilters} class="text-xs text-slate-500 hover:text-slate-700 ml-2 font-medium">
									Clear all
								</button>
							</div>
						{/if}
					</div>

					<!-- Bulk Actions Bar -->
					{#if hasSelectedFAQs && showBulkActions}
						<div class="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<p class="text-sm font-medium text-indigo-900">
										{selectedFAQs.size} FAQ{selectedFAQs.size > 1 ? 's' : ''} selected
									</p>
									<div class="w-px h-4 bg-indigo-300"></div>
									<button onclick={() => selectedFAQs.clear()} class="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
										Clear selection
									</button>
								</div>
								<div class="flex items-center gap-2">
									<button onclick={bulkPublish} class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors font-medium">
										<CheckCircle class="w-4 h-4 inline mr-1" />
										Publish
									</button>
									<button onclick={bulkArchive} class="px-3 py-1.5 bg-slate-600 text-white rounded-lg text-sm hover:bg-slate-700 transition-colors font-medium">
										<Archive class="w-4 h-4 inline mr-1" />
										Archive
									</button>
									<button onclick={bulkDelete} class="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors font-medium">
										<X class="w-4 h-4 inline mr-1" />
										Delete
									</button>
									<button onclick={() => showBulkActions = false} class="p-1.5 hover:bg-indigo-200 rounded-lg transition-colors">
										<X class="w-4 h-4 text-indigo-600" />
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Content Area -->
				{#if faqStore.error}
					<div class="bg-red-50 border border-red-200 rounded-2xl p-8">
						<div class="text-center">
							<AlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
							<h3 class="text-lg font-medium text-red-900 mb-2">Error Loading FAQs</h3>
							<p class="text-red-700">{faqStore.error}</p>
							<button onclick={refreshData} class="mt-4 btn-secondary">
								Try Again
							</button>
						</div>
					</div>
				{:else if faqStore.loading}
					<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
						<div class="text-center">
							<div class="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
							<p class="text-slate-600">Loading your FAQs...</p>
						</div>
					</div>
				{:else if faqStore.isEmpty}
					<div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
						<div class="text-center max-w-md mx-auto">
							<MessageSquare class="w-16 h-16 text-slate-300 mx-auto mb-6" />
							<h3 class="text-xl font-medium text-slate-900 mb-3">
								{hasActiveFilters ? 'No matching FAQs' : 'No FAQs yet'}
							</h3>
							<p class="text-slate-600 mb-6">
								{hasActiveFilters
									? 'Try adjusting your filters or search terms.'
									: 'Create your first FAQ to help users get instant answers.'
								}
							</p>
							<div class="flex items-center justify-center gap-3">
								{#if hasActiveFilters}
									<button onclick={resetAllFilters} class="btn-secondary">
										Clear Filters
									</button>
								{/if}
								<button class="btn-primary">
									<Plus class="w-4 h-4" />
									Create Your First FAQ
								</button>
							</div>
						</div>
					</div>
				{:else}
					<!-- FAQ Content -->
					<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

						<!-- Results Header -->
						<div class="px-6 py-4 bg-slate-50 border-b border-slate-200">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<CustomCheckbox
										checked={isAllSelected}
										indeterminate={isPartiallySelected}
										onchange={toggleSelectAll}
										size="md"
										variant="primary"
									/>
									<span class="text-sm text-slate-600">
										{faqStore.totalElements} FAQs found
									</span>
								</div>
								<div class="text-sm text-slate-500">
									Page {faqStore.currentPage + 1} of {faqStore.totalPages}
								</div>
							</div>
						</div>

						{#if viewMode === 'list'}
							<!-- List View -->
							<div class="divide-y divide-slate-200">
								{#each faqStore.data as faq, index (faq.uuid)}
									{@const StatusIcon = getStatusIcon(faq.status)}
									<div class="p-6 hover:bg-slate-50 transition-colors">
										<div class="flex items-start gap-4">
											<label class="flex items-center mt-1">
												<input
													type="checkbox"
													checked={selectedFAQs.has(faq.uuid)}
													onchange={() => toggleSelectFAQ(faq.uuid)}
													class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
												/>
											</label>

											<div class="flex-1 min-w-0">
												<div class="flex items-start justify-between gap-4 mb-3">
													<div class="flex-1">
														<h3 class="text-lg font-medium text-slate-900 mb-1">{faq.question}</h3>
														<p class="text-sm text-slate-600 line-clamp-2">
															Answer preview would go here...
														</p>
													</div>

													<div class="flex items-center gap-2">
														<StatusIcon class="w-4 h-4 text-slate-400" />
														<button class="p-2 hover:bg-slate-100 rounded-lg">
															<MoreHorizontal class="w-4 h-4 text-slate-400" />
														</button>
													</div>
												</div>

												<div class="flex items-center justify-between">
													<div class="flex items-center gap-4">
														<span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border {getStatusColor(faq.status)}">
															{getFAQStatusLabel(faq.status)}
														</span>
														<span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border {getPriorityColor(faq.priority)}">
															{getFAQPriorityLabel(faq.priority)}
														</span>
														{#if faq.category?.name}
															<span class="inline-flex items-center px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-md">
																{faq.category.name}
															</span>
														{/if}
													</div>

													<div class="flex items-center gap-4 text-sm text-slate-500">
														<div class="flex items-center gap-1">
															<Eye class="w-4 h-4" />
															{faq.viewCount.toLocaleString()}
														</div>
														<time>{formatDateTime(faq.createdAt)}</time>
													</div>
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<!-- Grid View -->
							<div class="p-6">
								<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{#each faqStore.data as faq (faq.uuid)}
										<div class="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition-colors border border-slate-200">
											<div class="flex items-start justify-between mb-4">
												<CustomCheckbox
													checked={selectedFAQs.has(faq.uuid)}
													onchange={() => toggleSelectFAQ(faq.uuid)}
													size="md"
													variant="primary"
												/>
												<button class="p-1 hover:bg-slate-200 rounded">
													<MoreHorizontal class="w-4 h-4 text-slate-400" />
												</button>
											</div>

											<h3 class="font-medium text-slate-900 mb-2 line-clamp-2">{faq.question}</h3>
											<p class="text-sm text-slate-600 mb-4 line-clamp-3">
												Answer preview would go here... This is where we would show the first few lines of the FAQ answer.
											</p>

											<div class="flex items-center justify-between mb-4">
												<div class="flex items-center gap-2">
													<span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border {getStatusColor(faq.status)}">
														{getFAQStatusLabel(faq.status)}
													</span>
													<span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border {getPriorityColor(faq.priority)}">
														{getFAQPriorityLabel(faq.priority)}
													</span>
												</div>
											</div>

											<div class="flex items-center justify-between text-xs text-slate-500">
												<div class="flex items-center gap-1">
													<Eye class="w-3 h-3" />
													{faq.viewCount.toLocaleString()}
												</div>
												<time>{formatDateTime(faq.createdAt)}</time>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Enhanced Pagination -->
						{#if faqStore.totalPages > 1}
							<div class="px-6 py-5 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200">
								<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
									<!-- Page Size & Info -->
									<div class="flex items-center gap-4">
										<div class="flex items-center gap-2">
											<span class="text-sm text-slate-600">Show:</span>
											<select
												value={faqStore.pageSize}
												onchange={handlePageSizeChange}
												class="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
											>
												<option value="10">10</option>
												<option value="20">20</option>
												<option value="50">50</option>
												<option value="100">100</option>
											</select>
											<span class="text-sm text-slate-600">per page</span>
										</div>

										<div class="hidden sm:block w-px h-6 bg-slate-300"></div>

										<div class="text-sm text-slate-600">
											Showing <span class="font-medium text-slate-900">{faqStore.currentPage * faqStore.pageSize + 1}</span> to <span class="font-medium text-slate-900">{Math.min((faqStore.currentPage + 1) * faqStore.pageSize, faqStore.totalElements)}</span> of <span class="font-medium text-slate-900">{faqStore.totalElements.toLocaleString()}</span> results
										</div>
									</div>

									<!-- Page Navigation -->
									<div class="flex items-center gap-1">
										<!-- First Page -->
										{#if faqStore.currentPage > 2}
											<button
												onclick={() => handlePageChange(0)}
												class="w-9 h-9 flex items-center justify-center text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
											>
												1
											</button>
											{#if faqStore.currentPage > 3}
												<span class="px-2 text-slate-400">…</span>
											{/if}
										{/if}

										<!-- Previous Button -->
										<button
											onclick={() => handlePageChange(faqStore.currentPage - 1)}
											disabled={!faqStore.hasPreviousPage}
											class="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
										>
											Previous
										</button>

										<!-- Page Numbers -->
										{#each Array(Math.min(faqStore.totalPages, 5)) as _, i}
											{@const pageNum = faqStore.currentPage <= 2 ? i : faqStore.currentPage - 2 + i}
											{#if pageNum < faqStore.totalPages && pageNum >= 0}
												<button
													onclick={() => handlePageChange(pageNum)}
													class="w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 {pageNum === faqStore.currentPage
														? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700'
														: 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200'}"
												>
													{pageNum + 1}
												</button>
											{/if}
										{/each}

										<!-- Next Button -->
										<button
											onclick={() => handlePageChange(faqStore.currentPage + 1)}
											disabled={!faqStore.hasNextPage}
											class="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
										>
											Next
										</button>

										<!-- Last Page -->
										{#if faqStore.currentPage < faqStore.totalPages - 3}
											{#if faqStore.currentPage < faqStore.totalPages - 4}
												<span class="px-2 text-slate-400">…</span>
											{/if}
											<button
												onclick={() => handlePageChange(faqStore.totalPages - 1)}
												class="w-9 h-9 flex items-center justify-center text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
											>
												{faqStore.totalPages}
											</button>
										{/if}
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
    .btn-primary {
        @apply inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium;
    }

    .btn-secondary {
        @apply inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium;
    }

    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>