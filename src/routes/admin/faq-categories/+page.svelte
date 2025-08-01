<!-- src/routes/admin/faq-category/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { faqCategoryAdminStore } from '$lib/stores/faqCategoryAdminStore';
	import { faqCategoryColumns } from './faqCategoryColumns';
	import { formatDateTime } from '$lib/components/utils/dateTimeFormat';
	import FAQCategoryForm from '$lib/components/Admin/FAQCategoryForm.svelte';
	import type { PageData } from './$types';
	import type { FAQCategory } from '$lib/types/faq';

	// Import your DataTable component - adjust this path to match your actual component
	// import DataTable from '$lib/components/ui/data-table/DataTable.svelte';

	// Icons from lucide-svelte
	import { CirclePlus, BarChart3, TrendingUp, Users, Eye } from 'lucide-svelte';

	// Props from page load
	let { data }: { data: PageData } = $props();

	// Component state
	let showForm = $state(false);
	let showAnalytics = $state(false);

	// Initialize data on mount
	onMount(async () => {
		if (data?.faqCategories) {
			faqCategoryAdminStore.categories = data.faqCategories;
		}

		// Load fresh data and analytics
		await faqCategoryAdminStore.reloadData();
	});

	/**
	 * Load table data (for refresh functionality)
	 */
	async function loadTableData() {
		await faqCategoryAdminStore.loadCategories();
	}

	/**
	 * Handle edit category
	 */
	async function handleEdit(event: Event) {
		const button = event.currentTarget as HTMLButtonElement;
		const categoryId = parseInt(button.dataset.categoryId || '0');

		if (categoryId) {
			try {
				await faqCategoryAdminStore.loadCategory(categoryId);
				faqCategoryAdminStore.openEditForm(faqCategoryAdminStore.selectedCategory!);
				showForm = true;
			} catch (error) {
				console.error('Failed to load category:', error);
				// You can add a toast notification here later
			}
		}
	}

	/**
	 * Handle toggle category status
	 */
	async function handleToggleStatus(event: Event) {
		const button = event.currentTarget as HTMLButtonElement;
		const categoryId = parseInt(button.dataset.categoryId || '0');
		const currentStatus = button.dataset.isActive === 'true';

		if (categoryId) {
			try {
				await faqCategoryAdminStore.toggleCategoryStatus(categoryId, !currentStatus);
				console.log(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
			} catch (error) {
				console.error('Failed to toggle category status:', error);
				// You can add a toast notification here later
			}
		}
	}

	/**
	 * Handle delete category
	 */
	async function handleDelete(event: Event) {
		const button = event.currentTarget as HTMLButtonElement;
		const categoryId = parseInt(button.dataset.categoryId || '0');
		const categoryName = button.dataset.categoryName || 'this category';

		if (categoryId && window.confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone and will affect all associated FAQs.`)) {
			try {
				await faqCategoryAdminStore.deleteCategory(categoryId);
				console.log('Category deleted successfully!');
			} catch (error) {
				console.error('Failed to delete category:', error);
				// You can add a toast notification here later
			}
		}
	}

	/**
	 * Open create form
	 */
	function openCreateForm() {
		faqCategoryAdminStore.openCreateForm();
		showForm = true;
	}

	/**
	 * Close form
	 */
	function closeForm() {
		showForm = false;
		faqCategoryAdminStore.closeForm();
	}

	/**
	 * Handle form save
	 */
	async function handleFormSave() {
		closeForm();
		await loadTableData(); // Refresh the table
	}

	// Computed values for analytics cards
	$effect(() => {
		// This will react to changes in the analytics data
		faqCategoryAdminStore.analytics;
	});
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">FAQ Categories</h1>
			<p class="text-gray-600 mt-1">Organize and manage your FAQ categories</p>
		</div>

		<div class="flex items-center gap-3">
			<button
				onclick={() => showAnalytics = !showAnalytics}
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
			>
				<BarChart3 class="w-4 h-4" />
				{showAnalytics ? 'Hide' : 'Show'} Analytics
			</button>

			<button
				onclick={openCreateForm}
				class="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
			>
				<CirclePlus class="w-4 h-4" />
				Create Category
			</button>
		</div>
	</div>

	<!-- Analytics Cards -->
	{#if showAnalytics}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Total Categories -->
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<Eye class="w-6 h-6 text-blue-600" />
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Total Categories</p>
						<p class="text-2xl font-bold text-gray-900">{faqCategoryAdminStore.analytics.totalCategories}</p>
					</div>
				</div>
			</div>

			<!-- Active Categories -->
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<TrendingUp class="w-6 h-6 text-green-600" />
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Active Categories</p>
						<p class="text-2xl font-bold text-gray-900">{faqCategoryAdminStore.analytics.activeCategories}</p>
					</div>
				</div>
			</div>

			<!-- Categories with FAQs -->
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<Users class="w-6 h-6 text-purple-600" />
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">With FAQs</p>
						<p class="text-2xl font-bold text-gray-900">{faqCategoryAdminStore.analytics.categoriesWithFAQs}</p>
					</div>
				</div>
			</div>

			<!-- Average FAQs per Category -->
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
							<BarChart3 class="w-6 h-6 text-orange-600" />
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600">Avg FAQs/Category</p>
						<p class="text-2xl font-bold text-gray-900">{faqCategoryAdminStore.analytics.averageFAQsPerCategory.toFixed(1)}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- DataTable -->
	<div class="bg-white rounded-lg shadow">
		<div class="p-6">
			<!-- Uncomment and adjust the path to your DataTable component -->
			<!--
			<DataTable
				data={faqCategoryAdminStore.categories}
				columns={faqCategoryColumns}
				loading={faqCategoryAdminStore.loading}
				loadTableData={loadTableData}
			/>
			-->

			<!-- Temporary table until you set up your DataTable -->
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left">
					<thead class="text-xs uppercase bg-gray-50">
					<tr>
						<th class="px-6 py-3">Order</th>
						<th class="px-6 py-3">Name</th>
						<th class="px-6 py-3">Description</th>
						<th class="px-6 py-3">FAQs</th>
						<th class="px-6 py-3">Status</th>
						<th class="px-6 py-3">Created</th>
						<th class="px-6 py-3">Actions</th>
					</tr>
					</thead>
					<tbody>
					{#each faqCategoryAdminStore.categories as category (category.id)}
						<tr class="border-b hover:bg-gray-50">
							<td class="px-6 py-4 text-center font-mono">{category.displayOrder}</td>
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 rounded-lg flex items-center justify-center"
											 style="background-color: {category.colorCode || '#6B7280'}20; border: 1px solid {category.colorCode || '#6B7280'}40;">
										<span style="color: {category.colorCode || '#6B7280'}">📁</span>
									</div>
									<div>
										<div class="font-semibold">{category.name}</div>
										<div class="text-xs text-gray-500">/{category.slug}</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								{#if category.description}
									<div class="text-sm text-gray-700" title={category.description}>
										{category.description.length > 60 ? category.description.substring(0, 60) + '...' : category.description}
									</div>
								{:else}
									<span class="text-gray-400 italic">No description</span>
								{/if}
							</td>
							<td class="px-6 py-4 text-center">
								<div class="font-semibold">{category.publishedFaqCount || 0}</div>
								<div class="text-xs text-gray-500">{category.faqCount || 0} total</div>
							</td>
							<td class="px-6 py-4">
								{#if category.isActive && category.isVisible}
										<span class="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
											<div class="w-2 h-2 rounded-full bg-green-500"></div>
											Active
										</span>
								{:else if category.isActive && !category.isVisible}
										<span class="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
											<div class="w-2 h-2 rounded-full bg-yellow-500"></div>
											Hidden
										</span>
								{:else}
										<span class="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
											<div class="w-2 h-2 rounded-full bg-gray-500"></div>
											Inactive
										</span>
								{/if}
							</td>
							<td class="px-6 py-4">
								<div class="text-sm">
									<div>{formatDateTime(new Date(category.createdAt))}</div>
									{#if category.createdBy}
										<div class="text-xs text-gray-500">by {category.createdBy}</div>
									{/if}
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex items-center gap-1">
									<button
										class="p-2 hover:bg-blue-100 rounded-md transition-colors"
										onclick={() => handleEdit({ currentTarget: { dataset: { categoryId: category.id.toString() } } })}
										title="Edit Category"
									>
										<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
										</svg>
									</button>
									<button
										class="p-2 hover:bg-yellow-100 rounded-md transition-colors"
										onclick={() => handleToggleStatus({ currentTarget: { dataset: { categoryId: category.id.toString(), isActive: category.isActive.toString() } } })}
										title="{category.isActive ? 'Deactivate' : 'Activate'} Category"
									>
										<svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											{#if category.isActive}
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
											{:else}
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"></path>
											{/if}
										</svg>
									</button>
									<button
										class="p-2 hover:bg-red-100 rounded-md transition-colors"
										onclick={() => handleDelete({ currentTarget: { dataset: { categoryId: category.id.toString(), categoryName: category.name } } })}
										title="Delete Category"
									>
										<svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
										</svg>
									</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="7" class="px-6 py-8 text-center text-gray-500">
								No FAQ categories found
							</td>
						</tr>
					{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Loading Overlay -->
	{#if faqCategoryAdminStore.loading && faqCategoryAdminStore.categories.length === 0}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg p-6 flex items-center gap-3">
				<div class="animate-spin w-6 h-6 border-2 border-nexus-primary border-t-transparent rounded-full"></div>
				<span class="text-gray-700">Loading FAQ categories...</span>
			</div>
		</div>
	{/if}

	<!-- Error Display -->
	{#if faqCategoryAdminStore.error && !faqCategoryAdminStore.loading}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error Loading Categories</h3>
					<p class="text-sm text-red-700 mt-1">{faqCategoryAdminStore.error}</p>
					<div class="mt-3">
						<button
							onclick={() => { faqCategoryAdminStore.clearError(); loadTableData(); }}
							class="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Form Modal -->
{#if showForm}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
			<FAQCategoryForm
				category={faqCategoryAdminStore.selectedCategory}
				mode={faqCategoryAdminStore.formMode}
				onSave={handleFormSave}
				onCancel={closeForm}
			/>
		</div>
	</div>
{/if}