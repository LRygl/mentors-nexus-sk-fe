<script lang="ts">
import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
import { UserTablePreset } from '$lib/components/Data Table/Configurations/UserTableConfiguration.js';
import { userStore } from '$lib/stores/defaults/UserStore.js';
import type { TableCallbacks } from '$lib/types/ui/table';
import { onMount } from 'svelte';
import type { User } from '$lib/types/entities/User';
import { ROUTES } from '$lib/Config/routes.config';
import { goto } from '$app/navigation';
import { legalTopicStore } from '$lib/stores/defaults/LegalTopicStore.svelte';
import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
import UniversalCreateModal from '$lib/components/ui/UniversalCreateModal.svelte';
import type { LegalTopic } from '$lib/types/entities/LegalTopic';
import { toastService } from '$lib/Services/ToastService.svelte';
import { LegalTopicFormPresets } from '$lib/components/Forms/Schemas/Legal/LegalTopicFormSchema';
import { UserFormPresets } from '$lib/components/Forms/Schemas/User/UserFormSchema';

let selectedItems = $state<Set<string>>(new Set());
let isCreateModalOpen = $state<boolean>(false);
let formRef: any;
const schema = $derived(UserFormPresets.standard())

// Data table configuration
const tableConfig = UserTablePreset.all();

onMount(async () => {
	await userStore.fetchAll();
});


// Table callbacks adapted for BaseStoreSvelte
const tableCallbacks: TableCallbacks<User> = {
	onRowClick: async (user: User) => {
		console.log(user);
		await goto(`${ROUTES.ADMIN.USERS}/${user.id}`)
	},

	onAction: async (actionId, user) => {
		if(!user.id) return;

		switch (actionId) {
			case 'view':
				await goto(`${ROUTES.ADMIN.USERS}/${user.id}`);
		}
	},

	onCreate: () => {
		createUserModal();
	}

}

async function createUserModal() {
	isCreateModalOpen = true;

}

function closeCreateModal() {
	isCreateModalOpen = false;
	formRef?.reset();
}

function handleModalSubmit(event: Event) {
	event.preventDefault()
	formRef?.submit();
}

// Form callbacks
const formCallbacks = {
	onSubmit: handleValidFormSubmit,
	onChange: (field: string, value: any) => {
	}
};

// Called when form validation passes
async function handleValidFormSubmit(formData: Partial<User>) {
	try {
		console.log("SUBMITTING FORM DATA: ", formData);
		const user = await userStore.create(formData);

		if (user?.id) {
			closeCreateModal();
			toastService.success(`Course Created`, `Successfully created ${user.email}`);
		}
	} catch (error) {
		console.error('Failed to create Course:', error);
		toastService.error('Failed to create course', error instanceof Error ? error.message : 'Unknown error');
	}
}


</script>

<!-- Main Container -->
<section class="h-dvh m-5">
	<!-- Header Section -->
	<AdminHeaderSection
		heading="Users"
		subHeading="Organize and manage your users with ease"
	/>

	<!-- Universal Data Table -->
	<UniversalDataTable
		data={userStore.data}
		loading={userStore.loading}
		error={userStore.error}
		config={tableConfig.config}
		columns={tableConfig.columns}
		callbacks={tableCallbacks}
		bind:selectedItems={selectedItems}
		getActions={tableConfig.getActions}
		{...tableConfig.props}
	/>
	<!-- Create Category Modal -->
	<UniversalCreateModal
		isOpen={isCreateModalOpen}
		title="Create User"
		subtitle="Add a new User"
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

</section>