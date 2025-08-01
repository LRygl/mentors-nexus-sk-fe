<!-- src/routes/admin/faq-category/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { faqCategoryAdminStore } from '$lib/stores/faqCategoryAdminStore';
	import { faqCategoryColumns, handleTableAction, simpleFaqCategoryColumns } from './faqCategoryColumns';
	import FAQCategoryForm from '$lib/components/Admin/FAQCategoryForm.svelte';
	import DataTable from '$lib/components/data-table.svelte';
	import { CirclePlus, BarChart3, TrendingUp, Users, Eye, Search, Filter } from 'lucide-svelte';

	// Try the complex columns first, fallback to simple if needed
	let tableColumns = faqCategoryColumns;

	// Component state
	let showForm = $state(false);
	let showAnalytics = $state(false);
	let searchQuery = $state('');
	let statusFilter = $state<'all' | 'active' | 'inactive'>('all');
	let debugMode = $state(true);

	// Initialize data on mount
	onMount(() => {
		console.log('🚀 Component mounted, loading categories...');

		// Handle async initialization separately
		const initializeData = async () => {
			try {
				await faqCategoryAdminStore.loadCategories();
				console.log('✅ Categories loaded successfully');
			} catch (error) {
				console.error('❌ Failed to load categories:', error);
			}
		};

		// Call async function immediately
		initializeData();

		// Set up event listeners
		const handleFormOpen = () => {
			showForm = true;
		};

		const handleErrorNotification = (event: CustomEvent) => {
			console.error('Error notification:', event.detail.message);
			// You can integrate with your notification system here
		};

		const handleSuccessNotification = (event: CustomEvent) => {
			console.log('Success notification:', event.detail.message);
			// You can integrate with your notification system here
		};

		window.addEventListener('openFAQCategoryForm', handleFormOpen);
		window.addEventListener('showError', handleErrorNotification as EventListener);
		window.addEventListener('showSuccess', handleSuccessNotification as EventListener);

		// Return cleanup function synchronously
		return () => {
			window.removeEventListener('openFAQCategoryForm', handleFormOpen);
			window.removeEventListener('showError', handleErrorNotification as EventListener);
			window.removeEventListener('showSuccess', handleSuccessNotification as EventListener);
		};
	});

	/**
	 * Load table data (for refresh functionality)
	 */
	async function loadTableData() {
		console.log('🔄 Refreshing table data...');
		try {
			await faqCategoryAdminStore.loadCategories();
			console.log('✅ Table data refreshed');
		} catch (error) {
			console.error('❌ Failed to refresh table data:', error);
		}
	}

	/**
	 * Handle table row click events (for action buttons)
	 */
	function handleTableRowClick(event: Event) {
		const target = event.target as HTMLElement;

		// Check if clicked element is an action button
		if (target.dataset.action) {
			event.preventDefault();
			event.stopPropagation();

			const action = target.dataset.action;
			const categoryId = parseInt(target.dataset.categoryId || '0');
			const additionalData = {
				currentStatus: target.dataset.currentStatus
			};

			if (categoryId) {
				handleTableAction(event, action, categoryId, additionalData);
			}
		}
	}

	// Computed filtered data
	let filteredCategories = $derived(() => {
		console.log('🔍 Computing filtered categories...');
		let categories = $faqCategoryAdminStore.categories;
		console.log('📊 Raw categories count:', categories.length);

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			categories = categories.filter(cat =>
				cat.name.toLowerCase().includes(query) ||
				cat.description?.toLowerCase().includes(query) ||
				cat.slug.toLowerCase().includes(query)
			);
			console.log('🔍 After search filter:', categories.length);
		}

		// Apply status filter
		if (statusFilter !== 'all') {
			categories = categories.filter(cat =>
				statusFilter === 'active' ? cat.isActive : !cat.isActive
			);
			console.log('🔍 After status filter:', categories.length);
		}

		return categories;
	});

	// Debug reactive statement
	$effect(() => {
		if (debugMode) {
			console.log('📊 Store state changed:', {
				categoriesCount: $faqCategoryAdminStore.categories.length,
				loading: $faqCategoryAdminStore.loading,
				error: $faqCategoryAdminStore.error,
				filteredCount: filteredCategories.length,
				columnsCount: tableColumns.length
			});
		}
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">FAQ Categories</h1>
			<p class="mt-1 text-sm text-gray-600">
				Manage your FAQ categories and their content
			</p>
		</div>

		<div class="flex space-x-3">
			<button
				class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
				onclick={() => showAnalytics = !showAnalytics}
			>
				<BarChart3 class="w-4 h-4 mr-2" />
				Analytics
			</button>

			<button
				class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
				onclick={() => {
          faqCategoryAdminStore.openCreateForm();
          showForm = true;
        }}
			>
				<CirclePlus class="w-4 h-4 mr-2" />
				Add Category
			</button>
		</div>
	</div>

	<!-- Debug Panel -->
	{#if debugMode}
		<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
			<h3 class="text-lg font-medium text-yellow-800 mb-2">🐛 Debug Information</h3>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
				<div>
					<span class="font-medium">Loading:</span>
					<span class={$faqCategoryAdminStore.loading ? 'text-blue-600' : 'text-green-600'}>
            {$faqCategoryAdminStore.loading ? 'Yes' : 'No'}
          </span>
				</div>
				<div>
					<span class="font-medium">Categories:</span>
					<span class="text-blue-600">{$faqCategoryAdminStore.categories.length}</span>
				</div>
				<div>
					<span class="font-medium">Filtered:</span>
					<span class="text-blue-600">{filteredCategories.length}</span>
				</div>
				<div>
					<span class="font-medium">Error:</span>
					<span class={$faqCategoryAdminStore.error ? 'text-red-600' : 'text-green-600'}>
            {$faqCategoryAdminStore.error || 'None'}
          </span>
				</div>
				<div>
					<span class="font-medium">Columns:</span>
				</div>
			</div>

			<div class="mt-3 flex space-x-2">
				<button
					class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs"
					onclick={loadTableData}
				>
					Reload Data
				</button>
				<button
					class="px-3 py-1 bg-green-100 text-green-700 rounded text-xs"
					onclick={() => faqCategoryAdminStore.clearError()}
				>
					Clear Error
				</button>
				<button
					class="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs"
					onclick={async () => {
            try {
              await faqCategoryAdminStore.loadAnalytics();
              console.log('Analytics loaded');
            } catch (error) {
              console.error('Failed to load analytics:', error);
            }
          }}
				>
					Load Analytics
				</button>

			</div>
		</div>
	{:else}
		<button
			class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs"
			onclick={() => debugMode = true}
		>
			Show Debug
		</button>
	{/if}

	<!-- Analytics Cards -->
	{#if showAnalytics}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<Eye class="w-6 h-6 text-blue-600" />
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Total Categories</p>
						<p class="text-2xl font-bold text-gray-900">{$faqCategoryAdminStore.analytics.totalCategories}</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<TrendingUp class="w-6 h-6 text-green-600" />
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Active Categories</p>
						<p class="text-2xl font-bold text-gray-900">{$faqCategoryAdminStore.analytics.activeCategories}</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<Users class="w-6 h-6 text-purple-600" />
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Categories with FAQs</p>
						<p class="text-2xl font-bold text-gray-900">{$faqCategoryAdminStore.analytics.categoriesWithFAQs}</p>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
							<BarChart3 class="w-6 h-6 text-orange-600" />
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Avg FAQs per Category</p>
						<p class="text-2xl font-bold text-gray-900">{$faqCategoryAdminStore.analytics.averageFAQsPerCategory.toFixed(1)}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Search and Filter -->
	<div class="bg-white rounded-lg shadow p-4">
		<div class="flex flex-col sm:flex-row gap-4">
			<div class="flex-1">
				<div class="relative">
					<Search class="w-5 h-5 absolute left-3 top-3 text-gray-400" />
					<input
						type="text"
						placeholder="Search categories..."
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						bind:value={searchQuery}
					/>
				</div>
			</div>

			<div class="flex items-center space-x-4">
				<div class="flex items-center space-x-2">
					<Filter class="w-4 h-4 text-gray-500" />
					<select
						class="border border-gray-300 rounded-lg px-3 py-2 text-sm"
						bind:value={statusFilter}
					>
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- Loading State -->
	{#if $faqCategoryAdminStore.loading}
		<div class="bg-white rounded-lg shadow p-8 text-center">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
			<p class="mt-2 text-gray-600">Loading categories...</p>
		</div>
	{/if}

	<!-- Error State -->
	{#if $faqCategoryAdminStore.error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4">
			<h3 class="text-red-800 font-medium">Error loading categories</h3>
			<p class="text-red-600 text-sm mt-1">{$faqCategoryAdminStore.error}</p>
			<button
				class="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
				onclick={loadTableData}
			>
				Retry
			</button>
		</div>
	{/if}

	<!-- DataTable with error boundary -->
	{#if !$faqCategoryAdminStore.loading && !$faqCategoryAdminStore.error}
		<div class="bg-white rounded-lg shadow" onclick={handleTableRowClick}>
			<DataTable
				data={filteredCategories}
				columns={tableColumns as any}
				loading={$faqCategoryAdminStore.loading}
				{loadTableData}
			/>
		</div>
	{/if}

	<!-- Form Modal -->
	{#if showForm}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<FAQCategoryForm
					category={$faqCategoryAdminStore.selectedCategory}
					mode={$faqCategoryAdminStore.formMode}
					onSave={async () => {
            showForm = false;
            faqCategoryAdminStore.closeForm();
            await loadTableData();
          }}
					onCancel={() => {
            showForm = false;
            faqCategoryAdminStore.closeForm();
          }}
				/>
			</div>
		</div>
	{/if}
</div>