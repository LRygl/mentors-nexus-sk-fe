<script lang="ts">
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import { onMount } from 'svelte';
	import { Check, Download, FileText, Plus, Settings } from 'lucide-svelte';
	import type { FAQCategory } from '$lib/types/entities/faqCategory';
	import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte';
	import ActionDropdown from '$lib/components/ui/ActionDropdown.svelte';
	import { goto } from '$app/navigation';
	import { getFAQCategoryActions } from './faqCategoryActions';
	import UniversalCreateModal from '$lib/components/ui/UniversalCreateModal.svelte';
	import FAQCategoryForm from '$lib/components/Forms/FAQCategoryForm.svelte';


	// Modal State
	let isCreateModalOpen = $state(false);
	let formIsValid = $state(false);
	let categoryFormRef: any;

	// Table State
	let selectedFAQCategories = $state<Set<string>>(new Set());
	let openDropdownId = $state<string | null>(null);
	let actionLoading = $state<Record<string, boolean>>({});

	// Derived states
	const hasData = $derived(faqCategoryStore.data.length > 0);
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
		formIsValid = false;
	}

	function handleFormValidation(data: { isValid: boolean } ) {
		formIsValid = data.isValid;
	}

	async function handleCreateSubmit(event: Event) {
		event.preventDefault();

		if (!categoryFormRef || !categoryFormRef.validateForm()) {
			return;
		}

		const formData = categoryFormRef.getFormData();

		try {
			const newCategory = await faqCategoryStore.createItem(formData);

			if (newCategory) {
				closeCreateModal();
				console.log('Category created sucessfully:', newCategory);
			}
		} catch (error) {
			console.log(error);
		}
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


</script>



<!-- Main Container -->
<section class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
	<div class="max-w-8xl mx-auto p-6">
		<!-- Dashboard Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between mb-6">
				<AdminHeaderSection heading="FAQ Category Administration" subHeading="Define and manage your FAQ Categories" />
				<div class="flex items-center gap-4">
					<!-- Unified Button Group - All Three Buttons -->
					<div class="inline-flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
						<button
							class="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors border-r border-slate-200 text-sm font-medium"
							onclick={() => console.log('Export data')}
						>
							<Download class="w-4 h-4" />
							Export
						</button>
						<button
							class="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors border-r border-slate-200 text-sm font-medium"
							onclick={() => console.log('Settings')}
						>
							<Settings class="w-4 h-4" />
							Settings
						</button>
						<button
							class="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
							onclick={openCreateModal}
							disabled={faqCategoryStore.creating}
						>
							<Plus class="w-4 h-4" />
							Create Category
						</button>
					</div>
				</div>
			</div>

		</div>
	</div>

	<!-- Table -->
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-gray-50/50">
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
                  : 'border-gray-300 hover:border-indigo-400'
                }
              `}>
							{#if isAllSelected}
								<Check class="h-3 w-3 text-white" />
							{:else if isPartiallySelected}
								<div class="w-2 h-2 bg-indigo-600 rounded-sm"></div>
							{/if}
						</div>
					</label>
				</th>
				<th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
					Name
				</th>
				<th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
					Color
				</th>
				<th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
					Questions
				</th>
				<th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
					Created
				</th>
				<th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
					Actions
				</th>
			</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
			{#each faqCategoryStore.data as category (category.uuid)}
				<tr
					class={`
              hover:bg-gray-50/50 transition-colors duration-200 group
              ${selectedFAQCategories.has(category.uuid) ? 'bg-indigo-50/50' : ''}
            `}
				>
					<td class="px-6 py-4">
						<label class="flex items-center cursor-pointer">
							<div
								class="flex items-center mt-1"
								onclick={(e) => e.stopPropagation()}
								role="none"
							>
							<input
								type="checkbox"
								checked={selectedFAQCategories.has(category.uuid)}
								onchange={() => toggleSelectFAQCategory(category.uuid)}
								onclick={(event) => event.stopPropagation()}
								class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
								aria-label={`Select FAQ: ${category.name}`}
							/>
							</div>
						</label>
					</td>
					<td class="px-6 py-4">
						<div class="flex items-center gap-3">
							<div
								class="w-3 h-7 rounded-xl ring-1 ring-white shadow-sm"
								style="background-color: {category.colorCode}"
							></div>
							<div>
								<div class="text-sm font-semibold text-gray-900">{category.name}</div>
								<div class="text-xs text-gray-500">ID: {category.id}</div>
							</div>
						</div>
					</td>
					<td class="px-6 py-4">
						<div class="flex items-center gap-2">
							<div
								class="w-6 h-6 rounded-lg ring-1 ring-gray-200 shadow-sm"
								style="background-color: {category.colorCode}"
							></div>

						</div>
					</td>
					<td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
								{category.faqCount} FAQ{category.faqCount !== 1 ? 's' : ''}
              </span>
					</td>
					<td class="px-6 py-4 text-sm text-gray-600">
						{category.createdAt}
					</td>
					<td class="px-6 py-4">
						<!-- Reusable Action Dropdown Component -->
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
</section>


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
	onclose={closeCreateModal}
	onsubmit={handleCreateSubmit}
>
	{#snippet children()}
		<FAQCategoryForm
			bind:this={categoryFormRef}
			onvalidate={handleFormValidation}
		/>
	{/snippet}
</UniversalCreateModal>