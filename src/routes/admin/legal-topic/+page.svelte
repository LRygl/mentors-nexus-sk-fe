<script lang="ts">
	import { onMount } from 'svelte';
	import { legalTopicStore } from '$lib/stores/defaults/LegalTopicStore';
	import { ROUTES } from '$lib/Config/routes.config';
	import { goto } from '$app/navigation';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import type { LegalTopic } from '$lib/types/entities/LegalTopic';
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import type { TableCallbacks } from '$lib/types/ui/table';
	import { LegalTopicTableConfiguration } from '$lib/components/Data Table/Configurations/LegalTopicTableConfiguration';
	import { LegalTopicFormPresets } from '$lib/components/Forms/Schemas/LegalTopicFormSchema';

	let selectedItems = $state<Set<string>>(new Set);
	let isCreateModalOpen = $state<boolean>(false);
	let formRef: any;
	let topics = $derived(legalTopicStore.data);

	const schema = $derived(LegalTopicFormPresets.standard())

	const tableConfig = LegalTopicTableConfiguration.all();

	onMount(async () => {
		await legalTopicStore.fetchAll();
	})

	const tableCallbacks: TableCallbacks<LegalTopic> = {
		onRowClick: async (legalTopic: LegalTopic) => {
			await goto(`${ROUTES.ADMIN.LEGAL_TOPIC}/${legalTopic.id}`);
		},

		onAction: async (actionId, legalTopic) => {
			if(!legalTopic.id) return;

			switch (actionId) {
				case 'view':
					await goto(`${ROUTES.ADMIN.LEGAL_TOPIC}/${legalTopic.id}`);
					break;
				case 'delete':
					await legalTopicStore.delete(legalTopic.id);
					break;
			}
		},

		onCreate: () => {
			createModal();
		}
	}

	/*
	* MODAL ACTION HANDLING
	*/
	async function createModal() {
		if (legalTopicStore.data.length === 0) {
			await legalTopicStore.fetchAll();
		}
		isCreateModalOpen = true;
	}

	function closeCreateModal() {
		isCreateModalOpen = false;
		formRef?.reset();
	}

	// Called when form validation passes
	async function handleValidFormSubmit(formData: Partial<LegalTopic>, imageFile?: File) {
		try {
			console.log("CREATING NEW OBJECT");
			console.log(formData);
			const newCourse = await legalTopicStore.create(formData);

			if (newCourse?.id) {
				closeCreateModal();
				toastService.success(`Course Created`, `Successfully created ${newCourse.name}`);
			}
		} catch (error) {
			console.error('Failed to create Course:', error);
			toastService.error('Failed to create course', error instanceof Error ? error.message : 'Unknown error');
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
		heading="Legal Topics"
		subHeading="Organize and manage your users with ease"
	/>

	<!-- Universal Data Table -->
	<UniversalDataTable
		data={topics}
		loading={legalTopicStore.loading}
		error={legalTopicStore.error}
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
	title="Create Terminal"
	subtitle="Add a new Terminal"
	icon=FileText
	iconBgColor="from-indigo-500 to-purple-600"
	loading={legalTopicStore.creating}
	error={legalTopicStore.createError}
	submitLabel="Create"
	onclose={closeCreateModal}
	onsubmit={handleModalSubmit}
>
	{#snippet children()}
		<UniversalForm
			bind:this={formRef}
			schema={schema}
			callbacks={formCallbacks}
			className="space-y-6"
		/>
	{/snippet}
</UniversalCreateModal>