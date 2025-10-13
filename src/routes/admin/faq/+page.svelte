<!-- src/routes/Admin/faq/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { faqStore } from '$lib/stores/defaults/faqStore.svelte';
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
	import {	FAQTablePreset	} from '$lib/components/Data Table/Configurations/FAQTableConfiguration';
	import type { TableCallbacks } from '$lib/types/ui/table';
	import type { FAQ } from '$lib/types';
	import { goto } from '$app/navigation';
	import type { FAQCreateFormData, FAQLinkData } from '$lib/types/entities/faq';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import { Link2 } from 'lucide-svelte';
	import { faqCategoryStore } from '$lib/stores/defaults/faqCategoryStore.svelte';
	import { confirmationModal } from '$lib/components/Modals/ConfirmationModalService.svelte';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import { FAQCategoryLinkPresets, FAQFormPresets } from '$lib/components/Forms/Schemas';


	let selectedItems = $state<Set<string>>(new Set());
	let isCreateModalOpen = $state<boolean>(false);
	let isLinkCategoryModalOpen = $state<boolean>(false);
	let formRef: any;
	let selectedFaqUuid = $state<string | null>(null);



	// Initialize data on component mount
	onMount(async () => {
		await faqStore.getAllFAQs(true);
		await faqCategoryStore.loadFAQCategories();
	});

	// Form schema
	const categories = $derived(faqCategoryStore.data || []);
	const createFormSchema = $derived(FAQFormPresets.standard(categories));

	// Add logging separately if needed
	$effect(() => {
		console.log('🔍 Schema groups:', createFormSchema.groups?.map(g => ({
			id: g.id,
			fields: g.fields.map(f => f.name)
		})));
	});

	const linkFAQCategoryFormSchema = $derived(FAQCategoryLinkPresets.link(categories))

	// Data table configuration
	const tableConfig = FAQTablePreset.all();

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
				case 'publish':
					await faqStore.publishFAQ(faq.uuid);
					break;
				case 'unpublish':
					await faqStore.unpublishFAQ(faq.uuid);
					break;
				case 'feature':
					await faqStore.feature(faq.uuid);
					break;
				case 'unfeature':
					await faqStore.unfeature(faq.uuid);
					break;
				case 'unlink-faq':
					const unlinkedFaq = await faqCategoryStore.unlinkFAQFromFAQCategory(faq.category.id,faq.uuid);
					faqStore.updateItemInStore(faq.uuid, unlinkedFaq);
					toastService.success("Success","FAQ unlinked from the parent category")
					break;
				case 'link-faq':
					await createLinkModal(faq.uuid);
					break;
				case 'delete':
					await deleteFAQRecord(faq.uuid);
					break;

			}
		},

		onCreate: () => {
			createModal();
		},
	}

	async function deleteFAQRecord(faqId: string): Promise<void> {
		const confirmed = await confirmationModal.confirm({
			variant: `delete`,
			title: `Delete FAQ?`,
			message: `Are you sure you want to delete this category? This action cannot be undone and the value will be removed from the database!`,
		})
		if (confirmed) {
			try {
				const success = await faqStore.delete(faqId);
				if (!success) {
					console.error('Failed to delete FAQ');
					// TODO: Show error notifications
				}
			} catch (error) {
				toastService.error('Failed to delete FAQ:',`Operation failed with error: ${error}`);
				console.error('Error deleting FAQ:', error);
			}
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
				toastService.success('Success',`FAQ ${newFaq.question} was created successfully`);
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


	/*
	* LINK MODAL HANDLING
	*/

	async function createLinkModal(faqUuid: string): Promise<void> {
		console.log("FAQ Link Called for record: ",faqUuid);
		selectedFaqUuid = faqUuid;
		isLinkCategoryModalOpen = true;
	}

	function closeLinkModal() {
		isLinkCategoryModalOpen = false;
		selectedFaqUuid = null;
		formRef?.reset();
	}

	function closeLinkCategoryModal() {
		isLinkCategoryModalOpen = false;
		formRef?.reset();
	}

	async function handleValidLinkCategorySubmit(data: FAQLinkData) {
		try {
			const linkedFaq = await faqCategoryStore.linkFAQToFAQCategory(selectedFaqUuid!,data.categoryUuid);
			if (linkedFaq && linkedFaq.id) {
				faqStore.updateItemInStore(selectedFaqUuid!, linkedFaq);
				closeLinkModal();
				toastService.success('Success',`FAQ ${linkedFaq.question} was created successfully`);
			}
		} catch (error) {
			console.error('Error creating FAQ:', error);
		}
	}

	// Form callbacks - validation is handled by UniversalForm
	const linkFormCallbacks = {
		onSubmit: handleValidLinkCategorySubmit,
		onChange: (field: string, value: any) => {
			if (field === 'isPublished' && !value) {
				// Clear category if needed
			}
		}
	};

	// Modal submit
	function handleLinkCategorySubmit(event: Event) {
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
		config={tableConfig.config}
		columns={tableConfig.columns}
		callbacks={tableActionCallbacks}
		bind:selectedItems={selectedItems}
		getActions={tableConfig.getActions}
		{...tableConfig.props}
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


<!-- Create Link FAQ Modal -->
<UniversalCreateModal
	isOpen={isLinkCategoryModalOpen}
	title="Link Category to FAQ"
	subtitle="Link existing FAQ Category"
	icon={Link2}
	iconBgColor="from-blue-500 to-indigo-600"
	loading={faqStore.loading}
	error={faqStore.error}
	submitLabel="Link FAQ Category"
	onclose={closeLinkCategoryModal}
	onsubmit={handleLinkCategorySubmit}
>
	{#snippet children()}
		<UniversalForm
			bind:this={formRef}
			schema={linkFAQCategoryFormSchema}
			callbacks={linkFormCallbacks}
			className="space-y-6"
		/>
	{/snippet}
</UniversalCreateModal>