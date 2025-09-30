<!-- src/routes/admin/faq/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { faqStore } from '$lib/stores/defaults/faqStore.svelte';
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import UniversalDataTable from '$lib/components/UI/UniversalDataTable.svelte';
	import { FAQTableConfigs } from './FAQTableConfigs';
	import type { TableCallbacks } from '$lib/types/ui/table';
	import type { FAQ } from '$lib/types';
	import { goto } from '$app/navigation';
	import { createFAQFormSchema, FAQFormPresets } from '$lib/components/Forms/Schemas/FAQFormSchema';
	import type { FAQCreateFormData } from '$lib/types/entities/faq';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import { AlertCircle, Link2 } from 'lucide-svelte';
	import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte';

	let selectedItems = $state<Set<string>>(new Set());
	let isCreateModalOpen = $state<boolean>(false);
	let formRef: any;

	// Form schema
	const createFormSchema = $derived(createFAQFormSchema('standard', faqCategoryStore.data || []));

	// Initialize data on component mount
	onMount(async () => {
		await faqStore.getAllFAQs(true);
	});

	/*
	* DATA TABLE ACTION HANDLING
	*/
	const tableActionCallbacks: TableCallbacks<FAQ> = {
		onRowClick: (faq) => {
			goto(`/admin/faq/${faq.id}`);
		},

		onAction: async (actionId, faq) => {
			switch (actionId) {
				case 'view':
					await goto(`/admin/faq/${faq.id}`);
					break;
				case 'edit':
					await goto(`/admin/faq/${faq.id}`);
					break;
				case 'unlink-faq':
					break;
				case 'delete':
					deleteFAQRecord(faq.uuid);
					break;

			}
		},

		onCreate: () => {
			createModal();
		},
	}

	async function deleteFAQRecord(faqId: string): Promise<void> {
		const confirmed = confirm('Are you sure you want to delete this FAQ?');
		if (!confirmed) return;

		try {
			const success = await faqStore.delete(faqId);
			if (!success) {
				console.error('Failed to delete FAQ');
				// TODO: Show error toast
			}
		} catch (error) {
			console.error('Error deleting FAQ:', error);
		}
	}





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

	// This is called ONLY when the form is valid
	async function handleValidFormSubmit(data: FAQCreateFormData) {
		try {
			const newFaq = await faqStore.create(data);
			if (newFaq && newFaq.id) {
				closeCreateModal();
			}
		} catch (error) {
			console.error('Error creating FAQ:', error);
		}
	}

	// Form callbacks - validation is handled by UniversalForm
	const formCallbacks = {
		onSubmit: handleValidFormSubmit,         // CHANGE: point to new function
		onChange: (field: string, value: any) => {
			if (field === 'isPublished' && !value) {
				// Clear category if needed
			}
		}
	};

	// Modal submit
	function handleModalSubmit(event: Event) {
		event.preventDefault();
		formRef?.submit();
	}

</script>

<!-- Main Container -->
<section class="h-dvh m-5">

	<!-- Header Section -->
	<AdminHeaderSection
		heading="FAQs"
		subHeading="Manage your frequently asked questions"
	/>

	<!-- FAQ Data Table -->
	<UniversalDataTable
		data={faqStore.data}
		loading={faqStore.loading}
		error={faqStore.error}
		config={FAQTableConfigs.FAQTableConfig()}
		columns={FAQTableConfigs.FAQTableColumnsConfig()}
		callbacks={tableActionCallbacks}
		bind:selectedItems={selectedItems}
		getActions={FAQTableConfigs.FAQTableActionsConfig}
		searchable={true}
		filterable={true}
		selectable={true}
		exportable={true}
		searchPlaceholder="Search categories..."
		emptyTitle="No FAQs yet"
		emptyDescription="Get started by defining questions which might be interesting to your users and provide simple answers."
		emptyActionLabel="Create your first FAQ!"
	/>

</section>

<!-- Create Link FAQ Modal -->
<UniversalCreateModal
	isOpen={isCreateModalOpen}
	title="Create new FAQ"
	subtitle="Create new FAQ record for your users"
	icon={Link2}
	iconBgColor="from-blue-500 to-indigo-600"
	loading={faqStore.loading}
	error={faqStore.error}
	submitLabel="Create FAQ"
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