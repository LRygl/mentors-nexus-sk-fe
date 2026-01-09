<script lang="ts">
import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
import { onMount } from 'svelte';
import type { TableCallbacks } from '$lib/types/ui/table';
import { CourseCategoryTablePreset } from '$lib/components/Data Table/Configurations/CourseCategoryTableConfiguration';
import { courseCategoryStore } from '$lib/stores/defaults/CourseCategoryStore';
import type { CourseCategory } from '$lib/types/entities/CourseCategory';
import { FileText } from 'lucide-svelte';
import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
import { CourseCategoryFormPresets } from '$lib/components/Forms/Schemas/CourseCategoryFormSchema';
import type { FAQCategoryFormData } from '$lib/types/entities/faqCategory';
import { toastService } from '$lib/Services/ToastService.svelte';
import { goto } from '$app/navigation';
import { confirmationModal } from '$lib/components/Modals/ConfirmationModalService.svelte';
import { ROUTES } from '$lib/Config/routes.config';
import { messages } from '$lib/i18n/messages';

	let isCreateModalOpen = $state<boolean>(false);
	let selectedItems = $state<Set<string>>(new Set);
	let formRef: any;

	const tableConfig = CourseCategoryTablePreset.all();


	onMount(async () => {
		await courseCategoryStore.fetchAll();
	});

const tableCallbacks: TableCallbacks<CourseCategory> = {
	onRowClick: async (courseCategory) => {
		await goto(ROUTES.ADMIN.courseCategory(courseCategory.id));

	},
	onAction: async (actionId, courseCategory) => {
		switch (actionId) {
			case 'view':
				await goto(ROUTES.ADMIN.courseCategory(courseCategory.id));
				break;
			case 'delete':
				const confirmed = await confirmationModal.delete(`Delete FAQ Category?`,`Are you sure you want to delete this category?`)
				if (confirmed) {
					try {
						await courseCategoryStore.delete(courseCategory.id);
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

	onCreate: () => {
		createModal();
	}
}

/*
* MODAL ACTION HANDLING
*/
async function createModal() {
	isCreateModalOpen = true;
}

function closeCreateModal() {
	isCreateModalOpen = false;
	formRef?.reset();
}

// Called when form validation passes
async function handleValidFormSubmit(data: FAQCategoryFormData) {
	try {
		const newCourseCategorz = await courseCategoryStore.create(data);
		if (newCourseCategorz && newCourseCategorz?.id) {
			closeCreateModal();
			toastService.success(`Course Category Created`,`Lipsum`)
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
		heading="Station Category"
		subHeading="Organize and manage your users with ease"
	/>

	<!-- Universal Data Table -->
	<UniversalDataTable
		data={courseCategoryStore.data}
		loading={courseCategoryStore.loading}
		error={courseCategoryStore.error}
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
	title={messages.courseCategory.forms.title}
	subtitle={messages.courseCategory.forms.subTitle}
	icon={FileText}
	iconBgColor="from-indigo-500 to-purple-600"
	loading={courseCategoryStore.creating}
	error={courseCategoryStore.createError}
	submitLabel={messages.courseCategory.forms.submitLabel}
	onclose={closeCreateModal}
	onsubmit={handleModalSubmit}
>
	{#snippet children()}
		<UniversalForm
			bind:this={formRef}
			schema={CourseCategoryFormPresets.standard()}
			callbacks={formCallbacks}
			className="space-y-6"
		/>
	{/snippet}
</UniversalCreateModal>