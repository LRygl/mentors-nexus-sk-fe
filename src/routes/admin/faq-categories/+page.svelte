<script lang="ts">
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import { onMount } from 'svelte';
	import { Check, Download, FileText, Plus, Settings } from '@lucide/svelte';
	import type { FAQCategory } from '$lib/types/entities/faqCategory';
	import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte';
	import ActionDropdown from '$lib/components/ui/ActionDropdown.svelte';
	import { goto } from '$app/navigation';
	import { getFAQCategoryActions } from './faqCategoryActions';
	import UniversalCreateModal from '$lib/components/ui/UniversalCreateModal.svelte';
	import { AlertCircle, Filter, RefreshCw, Search } from 'lucide-svelte';
	import DynamicIcon from '$lib/components/UI/DynamicIcon.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { getFAQCategoryFormSchema, transformToCreateRequest } from '$lib/components/Forms/FAQCategoryFormSchema';


	// Modal State
	let isCreateModalOpen = $state(false);
	let formRef: any;
	let formIsValid = $state(false);

	// Get form schema (can easily switch between variants)
	const formSchema = getFAQCategoryFormSchema('admin'); // or 'minimal', 'standard'

	// Table State
	let selectedFAQCategories = $state<Set<string>>(new Set());
	let openDropdownId = $state<string | null>(null);
	let actionLoading = $state<Record<string, boolean>>({});

	// Search and Filter State
	let searchQuery = $state('');
	let filteredData = $derived(() => {
		if (!searchQuery.trim()) return faqCategoryStore.data;
		return faqCategoryStore.data.filter(category =>
			category.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	// Derived states
	const hasData = $derived(filteredData.length > 0);
	const hasOriginalData = $derived(faqCategoryStore.data.length > 0);
	const isAllSelected = $derived(hasData && selectedFAQCategories.size === faqCategoryStore.data.length);
	const isPartiallySelected = $derived(selectedFAQCategories.size > 0 && selectedFAQCategories.size < faqCategoryStore.data.length);

	onMount(async () => {
		await faqCategoryStore.loadFAQCategories();
	})

	async function refreshData() {
		await faqCategoryStore.refresh();
	}

	function openCreateModal() {
		isCreateModalOpen = true;
	}

	function closeCreateModal() {
		isCreateModalOpen = false;
		formRef?.reset();
	}

  // Checkbox Toggle
	function toggleSelectAll() {
		if(isAllSelected) {
			selectedFAQCategories = new Set();
		} else {
			selectedFAQCategories = new Set(faqCategoryStore.data.map(faqCategory => faqCategory.uuid))
		}
	}

	function toggleSelectFAQCategory(uuid: string) {
		const newSelection = new Set(selectedFAQCategories);
		if (newSelection.has(uuid)) {
			newSelection.delete(uuid);
		} else {
			newSelection.add(uuid);
		}
		selectedFAQCategories = newSelection;

	}

	// Action Dropdown
	// Get actions configuration for each FAQ
	function getFAQCategoryActionsConfig(faqCategory: FAQCategory) {
		return getFAQCategoryActions(faqCategory);
	}

	async function handleFAQCategoryAction(event: { actionId: string; itemId: string }) {
		const { actionId, itemId } = event;
		const faqCategory = faqCategoryStore.data.find(f => f.uuid === itemId);

		if (!faqCategory) {
			console.error('FAQ Category not found', itemId);
			return;
		}

		actionLoading[itemId] = true;

		switch (actionId) {
			case 'view':
				await goto(`/admin/faq-categories/${faqCategory.id}`);
				break;
			default:
				console.warn('Unknown action: ', actionId);
		}
	}

	// Handle dropdown open/close events (simplified)
	function handleDropdownOpen(event: { itemId: string }) {
		openDropdownId = event.itemId;
	}

	function handleDropdownClose(event: { itemId: string }) {
		console.log('Dropdown closed for:', event.itemId);
		if (openDropdownId === event.itemId) {
			openDropdownId = null;
		}
	}


	function handleRowClick(event: MouseEvent, categoryId: number) {
		const target = event.target as HTMLElement;

		// Don't navigate if clicking on interactive elements
		if (
			target.tagName === 'INPUT' ||
			target.tagName === 'BUTTON' ||
			target.closest('button') ||
			target.closest('input') ||
			target.closest('label')
		) {
			return; // Exit early, don't navigate
		}

		// Navigate to category detail page
		goto(`/admin/faq-categories/${categoryId}`);
	}

	// Form handlers
	function handleFormValidation(result: { isValid: boolean }) {
		formIsValid = result.isValid;
	}

	async function handleCreateSubmit(event: Event) {
		event.preventDefault();

		if (!formRef?.validateFormExternal()) {
			return;
		}

		const formData = formRef.getFormData();
		const requestData = transformToCreateRequest(formData);

		try {
			const newCategory = await faqCategoryStore.createItem(requestData);
			if (newCategory) {
				closeCreateModal();
				await faqCategoryStore.refresh();
			}
		} catch (error) {
			console.error('Failed to create category:', error);
		}
	}

	// Form callbacks
	const formCallbacks = {
		onValidate: handleFormValidation,
		onChange: (field: string, value: any, formState: any) => {
			// Handle real-time form changes if needed
			console.log(`Field ${field} changed to:`, value);
		}
	};
</script>



<!-- Main Container -->
<section class="h-dvh">
	<div class="m-5">

		<!-- Header Section -->
		<div class="mb-8">
			<AdminHeaderSection
				heading="FAQ Categories"
				subHeading="Organize and manage your FAQ categories with ease"
			/>

			<!-- Action Bar with Search and Controls -->
			<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">
				<!-- Search and Filter Section -->
				<div class="flex flex-1 items-center gap-3">
					<div class="relative max-w-md flex-1">
						<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
						<input
							type="text"
							placeholder="Search categories..."
							bind:value={searchQuery}
							class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
						/>
					</div>
					<button class="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-200">
						<Filter class="h-4 w-4 text-slate-600" />
					</button>
				</div>

				<!-- Action Buttons -->
				<div class="flex items-center gap-3">
					{#if hasOriginalData}
						<div class="inline-flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
							<button
								class="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors border-r border-slate-200 text-sm font-medium"
								onclick={() => console.log('Export data')}
							>
								<Download class="w-4 h-4" />
								Export
							</button>
							<button
								class="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
								onclick={() => console.log('Settings')}
							>
								<Settings class="w-4 h-4" />
								Settings
							</button>
						</div>
					{/if}

					<button
						class="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
						onclick={openCreateModal}
						disabled={faqCategoryStore.creating}
					>
						<Plus class="w-4 h-4" />
						Create Category
					</button>
				</div>
			</div>
		</div>

		<!-- Content Area -->
		<div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden table-container">

			{#if faqCategoryStore.loading}
				<!-- Loading State -->
				<div class="flex flex-col items-center justify-center py-16">
					<div class="relative">
						<div class="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
					</div>
					<h3 class="mt-4 text-lg font-semibold text-slate-700">Loading Categories</h3>
					<p class="mt-1 text-sm text-slate-500">Please wait while we fetch your data...</p>
				</div>

			{:else if faqCategoryStore.error}
				<!-- Error State -->
				<div class="flex flex-col items-center justify-center py-16 px-6">
					<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
						<AlertCircle class="w-8 h-8 text-red-600" />
					</div>
					<h3 class="text-xl font-semibold text-slate-900 mb-2">Something went wrong</h3>
					<p class="text-slate-600 text-center mb-6 max-w-md">
						We encountered an error while loading your FAQ categories. Please try again.
					</p>
					<div class="flex gap-3">
						<button
							onclick={refreshData}
							class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
						>
							<RefreshCw class="w-4 h-4" />
							Try Again
						</button>
						<button
							onclick={openCreateModal}
							class="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium"
						>
							<Plus class="w-4 h-4" />
							Create Category
						</button>
					</div>
				</div>

			{:else if !hasOriginalData}
				<!-- Empty State - No Data -->
				<div class="flex flex-col items-center justify-center py-20 px-6">
					<div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
						<FileText class="w-10 h-10 text-indigo-600" />
					</div>
					<h3 class="text-2xl font-semibold text-slate-900 mb-3">No FAQ Categories Yet</h3>
					<p class="text-slate-600 text-center mb-8 max-w-md leading-relaxed">
						Get started by creating your first FAQ category. Categories help organize your frequently asked questions for better user experience.
					</p>
					<button
						onclick={openCreateModal}
						class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
					>
						<Plus class="w-5 h-5" />
						Create Your First Category
					</button>
				</div>

			{:else if hasData}
				<!-- Empty Search Results -->
				<div class="flex flex-col items-center justify-center py-16 px-6">
					<div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
						<Search class="w-8 h-8 text-slate-400" />
					</div>
					<h3 class="text-lg font-semibold text-slate-900 mb-2">No results found</h3>
					<p class="text-slate-600 text-center mb-6">
						We couldn't find any categories matching "<span class="font-medium">{searchQuery}</span>". Try adjusting your search terms.
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
				<div class="table-wrapper">
					<table class="w-full">
						<thead class="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
						<tr>
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
							<th class="px-2 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
								Order
							</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
								Category
							</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
								Color
							</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
								Questions
							</th>
							<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
								Created
							</th>
							<th class="pr-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
								Actions
							</th>
						</tr>
						</thead>
						<tbody class="divide-y divide-slate-100">
						{#each faqCategoryStore.data as category (category.uuid)}
							<tr class={`
									hover:bg-slate-50/50 transition-all duration-200 group cursor-pointer
									${selectedFAQCategories.has(category.uuid) ? 'bg-indigo-50/50' : ''}
									hover:shadow-sm hover:scale-[1.002] transform-gpu
								`}
							onclick={(e) => handleRowClick(e, category.id)}
									role="button"
									tabindex="0"
									onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleRowClick(e, category.id);
									}
								}}
									aria-label={`View details for ${category.name}`}
							>
								<td class="px-6 py-4">
									<label class="flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={selectedFAQCategories.has(category.uuid)}
											onchange={() => toggleSelectFAQCategory(category.uuid)}
											onclick={(event) => event.stopPropagation()}
											class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2"
											aria-label={`Select FAQ: ${category.name}`}
										/>
									</label>
								</td>
								<td class="px-2 py-4 text-center">
									{category.displayOrder}
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
											<DynamicIcon
												iconName={category.iconClass || 'HelpCircle'}
												class="text-white"
												size={20}
											/>
										</div>
										<div>
											<div class="text-sm font-semibold text-slate-900">{category.name}</div>
											<div class="text-xs text-slate-500">ID: {category.id}</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div
											class="w-6 h-6 rounded-lg ring-2 ring-white shadow-sm border border-slate-200"
											style="background-color: {category.colorCode}"
											title="Category color: {category.colorCode}"
										></div>
										<span class="text-xs font-mono text-slate-500 uppercase">{category.colorCode}</span>
									</div>
								</td>
								<td class="px-6 py-4">
										<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
											{category.faqCount} {category.faqCount === 1 ? 'FAQ' : 'FAQs'}
										</span>
								</td>
								<td class="px-6 py-4 text-sm text-slate-600">
									{category.createdAt}
								</td>
								<td class="px-6 py-4 table-cell-with-dropdown">
									<div onclick={(e) => e.stopPropagation()} role="none">
										<ActionDropdown
											itemId={category.uuid}
											itemTitle={category.name}
											actions={getFAQCategoryActionsConfig(category)}
											buttonVariant="outline"
											buttonSize="sm"
											dropdownWidth="w-64"
											position="right"
											isOpen={openDropdownId === category.uuid}
											onaction={handleFAQCategoryAction}
											onopen={handleDropdownOpen}
											onclose={handleDropdownClose}
										/>
									</div>
								</td>
							</tr>
						{/each}
						</tbody>
					</table>
				</div>

				<!-- Table Footer with Selection Info -->
				{#if selectedFAQCategories.size > 0}
					<div class="px-6 py-4 bg-slate-50 border-t border-slate-200">
						<div class="flex items-center justify-between">
							<p class="text-sm text-slate-600">
								{selectedFAQCategories.size} of {filteredData.length} categories selected
							</p>
							<div class="flex gap-2">
								<button class="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 transition-colors">
									Bulk Edit
								</button>
								<button class="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 transition-colors">
									Delete Selected
								</button>
							</div>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</section>

<!-- Create Category Modal -->
<!-- Create Category Modal -->
<UniversalCreateModal
	isOpen={isCreateModalOpen}
	title="Create FAQ Category"
	subtitle="Add a new category to organize your FAQs"
	icon={FileText}
	iconBgColor="from-indigo-500 to-purple-600"
	loading={faqCategoryStore.creating}
	error={faqCategoryStore.createError}
	submitLabel="Create Category"
	submitDisabled={!formIsValid}
	onclose={closeCreateModal}
	onsubmit={handleCreateSubmit}
>
	{#snippet children()}
		<!-- Universal Form - No more custom form component needed! -->
		<UniversalForm
			bind:this={formRef}
			schema={formSchema}
			callbacks={formCallbacks}
			className="space-y-6"
		/>
	{/snippet}
</UniversalCreateModal>


<style>
    /* Add these styles to your page */
    .table-container {
        position: relative;
        overflow: visible;
    }

    .table-wrapper {
        overflow-x: auto; /* Move horizontal scroll here */
        position: static;
    }

    .table-cell-with-dropdown {
        position: static !important;
        overflow: visible !important;
    }

    /* Ensure dropdowns appear above everything */
    :global(.action-dropdown-menu) {
        z-index: 9999 !important;
    }
</style>