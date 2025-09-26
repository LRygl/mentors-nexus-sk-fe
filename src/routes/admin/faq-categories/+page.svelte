<!-- src/routes/admin/faq-categories/+page.svelte -->
<script lang="ts">
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import UniversalDataTable from '$lib/components/UI/UniversalDataTable.svelte';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { FileText } from 'lucide-svelte';

	import type { FAQCategory } from '$lib/types/entities/faqCategory';
	import type { TableCallbacks } from '$lib/types/ui/table';

	import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte';
	import { getFAQCategoryActions } from './faqCategoryActions';
	import { getFAQCategoryFormSchema, transformToCreateRequest } from '$lib/components/Forms/FAQCategoryFormSchema';
	import { faqCategoryTableColumns, faqCategoryTableConfig } from './fatCategoryTableConfig';

	// Modal and Form State
	let isCreateModalOpen = $state(false);
	let formRef: any;
	let formIsValid = $state(false);
	let selectedItems = $state<Set<string>>(new Set());

	// Table callbacks adapted for BaseStoreSvelte
	const tableCallbacks: TableCallbacks<FAQCategory> = {
		onRowClick: (category) => {
			console.log(`FAQ Categor row ${category.id} clicked`);
			goto(`/admin/faq-categories/${category.id}`);
		},

		onAction: async (actionId, category) => {
			switch (actionId) {
				case 'view':
					console.log("View Action was called by the user in the dropdown")
					await goto(`/admin/faq-categories/${category.id}`);
					break;
				case 'edit':
					await goto(`/admin/faq-categories/${category.id}/edit`);
					break;
				case 'duplicate':
					// Use the store's create method
					try {
						const duplicateData = {
							name: `${category.name} (Copy)`,
							displayOrder: category.displayOrder + 1,
							colorCode: category.colorCode,
							// Add other required fields
						} as any; // Replace with proper CreateFAQCategoryRequest type

						await faqCategoryStore.create(duplicateData);
						console.log('Category duplicated successfully');
					} catch (error) {
						console.error('Failed to duplicate category:', error);
					}
					break;
				case 'delete':
					if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
						try {
							await faqCategoryStore.delete(category.id || category.uuid);
							console.log('Category deleted successfully');
						} catch (error) {
							console.error('Failed to delete category:', error);
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
			openCreateModal();
		},

		onExport: (data) => {
			exportToCSV(data, 'faq-categories.csv');
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

	// Form schema
	const formSchema = getFAQCategoryFormSchema('admin');

	// Lifecycle - load data properly
	onMount(async () => {
		console.log('Component mounted, loading FAQ categories...');
		try {
			await faqCategoryStore.loadFAQCategories();
		} catch (error) {
		}
	});

	// Modal functions
	function openCreateModal() {
		isCreateModalOpen = true;
	}

	function closeCreateModal() {
		isCreateModalOpen = false;
		formRef?.reset();
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
			// Use the store's create method
			const newCategory = await faqCategoryStore.create(requestData);
			if (newCategory) {
				closeCreateModal();
				// No need to refresh - the store automatically updates the data array
			}
		} catch (error) {
			console.error('Failed to create category:', error);
		}
	}

	// Form callbacks
	const formCallbacks = {
		onValidate: handleFormValidation,
		onChange: (field: string, value: any, formState: any) => {
			console.log(`Field ${field} changed to:`, value);
		}
	};

	// Export utility
	function exportToCSV(data: FAQCategory[], filename: string): void {
		if (data.length === 0) return;

		const csvData = data.map(item => ({
			ID: item.id,
			Name: item.name,
			'Display Order': item.displayOrder,
			'Color Code': item.colorCode,
			'FAQ Count': item.faqCount,
			Created: item.createdAt
		}));

		const headers = Object.keys(csvData[0]);
		const csvRows = [
			headers.join(','),
			...csvData.map(row =>
				headers.map(header => {
					const value = (row as any)[header] ?? '';
					return `"${String(value).replace(/"/g, '""')}"`;
				}).join(',')
			)
		];

		const csv = csvRows.join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);

		link.setAttribute('href', url);
		link.setAttribute('download', filename);
		link.style.visibility = 'hidden';

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		URL.revokeObjectURL(url);
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
		config={faqCategoryTableConfig}
		columns={faqCategoryTableColumns}
		callbacks={tableCallbacks}
		bind:selectedItems={selectedItems}
		getActions={getFAQCategoryActions}
		searchable={true}
		filterable={true}
		selectable={true}
		exportable={true}
		searchPlaceholder="Search categories..."
		emptyTitle="No FAQ Categories Yet"
		emptyDescription="Get started by creating your first FAQ category. Categories help organize your frequently asked questions for better user experience."
		emptyActionLabel="Create Your First Category"
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
	submitDisabled={!formIsValid}
	onclose={closeCreateModal}
	onsubmit={handleCreateSubmit}
>
	{#snippet children()}
		<UniversalForm
			bind:this={formRef}
			schema={formSchema}
			callbacks={formCallbacks}
			className="space-y-6"
		/>
	{/snippet}
</UniversalCreateModal>