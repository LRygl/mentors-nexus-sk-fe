<!-- src/routes/admin/faq-categories/+page.svelte -->
<script lang="ts">
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import UniversalDataTable from '$lib/components/UI/UniversalDataTable.svelte';
	import UniversalCreateModal from '$lib/components/ui/UniversalCreateModal.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { FileText } from 'lucide-svelte';

	import type { FAQCategory } from '$lib/types/entities/faqCategory';
	import type { TableColumn, TableConfig, TableCallbacks } from '$lib/types/ui/table';
	import { TableColumnBuilder, CommonColumns } from '$lib/types/ui/table';

	import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte';
	import { getFAQCategoryActions } from './faqCategoryActions';
	import { getFAQCategoryFormSchema, transformToCreateRequest } from '$lib/components/Forms/FAQCategoryFormSchema';

	// Modal and Form State
	let isCreateModalOpen = $state(false);
	let formRef: any;
	let formIsValid = $state(false);
	let selectedItems = $state<Set<string>>(new Set());

	// TODO Move to separate configuration file
	// Table Configuration - Check your FAQCategory interface for correct field names
	const tableConfig: TableConfig<FAQCategory> = {
		idField: 'id', // or 'id' - check what your API returns
		titleField: 'name',
		createButtonLabel: 'Create Category',
		loadingTitle: 'Loading Categories',
		loadingDescription: 'Please wait while we fetch your FAQ categories...',
		itemName: 'category',
		itemNamePlural: 'categories'
	};

	// TODO Move to separate column definition file
	// Simple columns for debugging - expand once working
	const columns: TableColumn<FAQCategory>[] = [
		{
			key: 'id',
			header: 'ID',
			searchable: false,
			cellClassName: 'font-mono text-xs text-slate-500'
		},
		{
			key: 'name',
			header: 'Name',
			searchable: true,
		},
		{
			key: 'iconClass',
			header: 'Icon',
			searchable: true,
			renderType: 'custom',
			cellClassName: 'font-semibold text-slate-900'
		},

		{
			key: 'displayOrder',
			header: 'Order',
			searchable: false,
			cellClassName: 'text-center',
			headerClassName: 'text-center',
			width: 'w-20'
		},
		TableColumnBuilder.count<FAQCategory>('faqCount', 'Questions', {
			singular: 'FAQ',
			plural: 'FAQs',
			color: 'bg-slate-100 text-slate-700'
		}),
		TableColumnBuilder.date<FAQCategory>('createdAt', 'Created', {
			format: 'short'
		})
	];

	// Table callbacks adapted for BaseStoreSvelte
	const tableCallbacks: TableCallbacks<FAQCategory> = {
		onRowClick: (category) => {
			console.log('Row clicked:', category);
			goto(`/admin/faq-categories/${category.id}`);
		},

		onAction: async (actionId, category) => {
			console.log('Action triggered:', actionId, category);

			switch (actionId) {
				case 'view':
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
			console.log('Selection changed:', selectedIds);
			selectedItems = new Set(selectedIds);
		},

		onRefresh: async () => {
			console.log('Refresh triggered');
			await faqCategoryStore.refresh();
		},

		onCreate: () => {
			console.log('Create triggered');
			openCreateModal();
		},

		onExport: (data) => {
			console.log('Export triggered with data:', data);
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
					console.log('Bulk delete completed');
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
			console.log('Data loaded successfully');
		} catch (error) {
			console.error('Failed to load data:', error);
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
		console.log('Form validation:', result);
	}

	async function handleCreateSubmit(event: Event) {
		event.preventDefault();
		console.log('Form submit triggered');

		if (!formRef?.validateFormExternal()) {
			console.log('Form validation failed');
			return;
		}

		const formData = formRef.getFormData();
		console.log('Form data:', formData);

		const requestData = transformToCreateRequest(formData);
		console.log('Transformed request data:', requestData);

		try {
			// Use the store's create method
			const newCategory = await faqCategoryStore.create(requestData);
			console.log('Category created:', newCategory);

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
		console.log('Exporting CSV with data:', data);

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
<section class="h-dvh">
	<div class="m-5">
		<!-- Header Section -->
		<div class="mb-8">
			<AdminHeaderSection
				heading="FAQ Categories"
				subHeading="Organize and manage your FAQ categories with ease"
			/>
		</div>

		<!-- Universal Data Table - Fix reactivity binding -->
		<UniversalDataTable
			data={faqCategoryStore.data}
			loading={faqCategoryStore.loading}
			error={faqCategoryStore.error}
			config={tableConfig}
			columns={columns}
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