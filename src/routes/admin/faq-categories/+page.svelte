<!-- src/routes/Admin/faq-categories/+page.svelte -->
<script lang="ts">
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';

	import { onMount } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { FileText } from 'lucide-svelte';

	import type { FAQCategory, FAQCategoryFormData } from '$lib/types/entities/faqCategory';
	import type { TableCallbacks } from '$lib/types/ui/table';

	import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte';
	import { createFAQCategoryFormSchema } from '$lib/components/Forms/Schemas/FAQCategoryFormSchema';
	import { confirmationModal } from '$lib/components/Modals/ConfirmationModalService.svelte';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import { FAQCategoryTablePreset } from '$lib/components/Data Table/Configurations/FAQCategoryConfiguration';
	import { ROUTES } from '$lib/Config/routes.config';

	// Modal and Form State
	let isCreateModalOpen = $state<boolean>(false);
	let formRef: any;
	let selectedItems = $state<Set<string>>(new Set());

	// Form schema
	const createFormSchema = $derived(createFAQCategoryFormSchema(`quick`));

	// Data table configuration
	const tableConfig = FAQCategoryTablePreset.all();

	// Initialize data on component mount
	onMount(async () => {
		try {
			await faqCategoryStore.loadFAQCategories();
		} catch (error) {
		}
	});


	afterNavigate(async ({ from, to }) => {
		console.log('Navigation:', from?.url.pathname, '→', to?.url.pathname);

		// Refresh if coming from a category detail page
		if (from?.url.pathname?.includes('/admin/faq-categories/') &&
			from?.url.pathname !== '/admin/faq-categories') {
			console.log('🔄 Refreshing categories after detail page visit');
			await faqCategoryStore.refresh();
		}
	});

	// Table callbacks adapted for BaseStoreSvelte
	const tableCallbacks: TableCallbacks<FAQCategory> = {
		onRowClick: async (category) => {
			await goto(`${ROUTES.ADMIN.FAQ_CATEGORIES}/${category.id}`);
		},

		onAction: async (actionId, category) => {
			switch (actionId) {
				case 'view':
					await goto(`${ROUTES.ADMIN.FAQ_CATEGORIES}/${category.id}`);
					break;
				case 'duplicate':
					// Use the store's create method
					try {
						const duplicateData = {
							name: `${category.name} (Copy)`,
							displayOrder: category.displayOrder + 1,
							colorCode: category.colorCode,
							// Add other required Fields
						} as any; // Replace with proper CreateFAQCategoryRequest type

						await faqCategoryStore.create(duplicateData);
						console.log('Category duplicated successfully');
					} catch (error) {
						console.error('Failed to duplicate category:', error);
					}
					break;
				case 'delete':

					const confirmed = await confirmationModal.delete(`Delete FAQ Category?`,`Are you sure you want to delete this category?`)

					if (confirmed) {
						try {
							await faqCategoryStore.delete(category.uuid);
							console.log('Category deleted successfully');
						} catch (error) {
							console.error('Failed to delete category:', error);
							toastService.error('Failed to delete category:',`Operation failed with error: ${error}`);
						}
					}
					break;
				default:
					console.warn('Unknown action:', actionId);
			}
		},

		onSelectionChange: (selectedIds) => {
			selectedItems = new Set(selectedIds);
		},

		onRefresh: async () => {
			await faqCategoryStore.refresh();
		},

		onCreate: () => {
			console.log('Create triggered');
			createModal();
		},

		onBulkEdit: (selectedIds) => {
			console.log('Bulk edit for items:', selectedIds);
		},

		onBulkDelete: async (selectedIds) => {
			if (confirm(`Are you sure you want to delete ${selectedIds.length} categories?`)) {
				try {
					// Delete each selected item
					for (const id of selectedIds) {
						await faqCategoryStore.delete(id);
					}
					selectedItems = new Set();
				} catch (error) {
					console.error('Failed to delete categories:', error);
				}
			}
		}
	};

	/*
	* MODAL ACTION HANDLING
	*/
	async function createModal() {
		//await loadAllFAQs();
		// Small delay to ensure reactivity has processed
		//await new Promise(resolve => setTimeout(resolve, 10));
		isCreateModalOpen = true;
	}

	function closeCreateModal() {
		isCreateModalOpen = false;
		formRef?.reset();
	}

	// Called when form validation passes
	async function handleValidFormSubmit(data: FAQCategoryFormData) {
		try {
			const newCategory = await faqCategoryStore.create(data);
			if (newCategory && newCategory?.id) {
				closeCreateModal();
				toastService.success(`FAQ Category Created`,`Lipsum`)
				// TODO: Add notifications notification
			}
		} catch (error) {
			console.error('Failed to create category:', error);
		}
	}

	// Form callbacks
	const formCallbacks = {
		onSubmit: handleValidFormSubmit,
		onChange: (field: string, value: any) => {

		}
	};

	// Modal submit
	function handleModalSubmit(event: Event) {
		event.preventDefault()
		formRef?.submit();
	}

</script>

<!-- Main Container -->
<section class="h-dvh m-5">

	<!-- Header Section -->
	<AdminHeaderSection
		heading="FAQ Categories"
		subHeading="Organize and manage your FAQ categories with ease"
	/>

	<!-- Universal Data Table -->
	<UniversalDataTable
		data={faqCategoryStore.data}
		loading={faqCategoryStore.loading}
		error={faqCategoryStore.error}
		config={tableConfig.config}
		columns={tableConfig.columns}
		callbacks={tableCallbacks}
		bind:selectedItems={selectedItems}
		getActions={tableConfig.getActions}
		{...tableConfig.props}
	/>

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
	onsubmit={handleModalSubmit}
>
	{#snippet children()}
		<UniversalForm
			bind:this={formRef}
			schema={createFormSchema}
			callbacks={formCallbacks}
			className="space-y-6"
		/>
	{/snippet}
</UniversalCreateModal>