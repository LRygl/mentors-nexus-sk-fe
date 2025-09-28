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
	import { createFAQFormSchema } from '$lib/components/Forms/FAQFormSchema';
	import type { FAQCreateFormData } from '$lib/types/entities/faq';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import { Link2 } from 'lucide-svelte';

	let selectedItems = $state<Set<string>>(new Set());
	let isCreateModalOpen = $state<boolean>(false);
	let formRef: any;
	let createFormData = $state<Partial<FAQCreateFormData>>({});
	let createFormDataValid = $state(false);

	// Form schema
	const createFormSchema = $derived(createFAQFormSchema());


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

			}
		},

		onCreate: () => {
			createModal();
		},
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
		createFormData = {};
	}

	async function handleCreateFormSubmit(event: Event) {
		event.preventDefault();

		const createFormData = formRef.getFormData();
		console.log(createFormData);

		try {
			const newFaq = await faqStore.create(createFormData);
			if (newFaq) {
				closeCreateModal();
			}
		} catch (error) {
			console.error(error);
		}

	}

	function handleFormValidation(result: { isValid: boolean }) {
		createFormDataValid = result.isValid;
	}

	// Form callbacks
	const formCallbacks = {
		onValidate: handleFormValidation,
		onChange: (field: string, value: any) => {
			createFormData = { ...createFormData, [field]: value };

			// Special handling for isPublished change
			if (field === 'isPublished' && !value) {
				// Clear FAQ category when unpublishing
				createFormData.categoryId = undefined;
			}
		}
	};

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
	onsubmit={handleCreateFormSubmit}
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