<script lang="ts">
	import { userStore } from '$lib/stores/defaults/UserStore.js';
	import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import { onMount } from 'svelte';
	import type { TableCallbacks } from '$lib/types/ui/table';
	import { LessonTablePreset } from '$lib/components/Data Table/Configurations/LessonTableConfiguration';
	import { lessonStore } from '$lib/stores/defaults/LessonStore';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/Config/routes.config';
	import type { Lesson } from '$lib/types/entities/Lesson';
	import { FileText } from 'lucide-svelte';
	import { courseStore } from '$lib/stores/defaults/CourseStore';
	import { CourseFormPresets } from '$lib/components/Forms/Schemas/CourseFormSchema';
	import { courseCategoryStore } from '$lib/stores/defaults/CourseCategoryStore';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import type { Course } from '$lib/types/entities/Course';
	import { confirmationModal } from '$lib/components/Modals/ConfirmationModalService.svelte';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import { LessonFormPresets } from '$lib/components/Forms/Schemas/LessonFormSchema';

	let selectedItems = $state<Set<string>>(new Set());
	let isCreateModalOpen = $state<boolean>(false);
	let formRef: any;

	const tableConfig = LessonTablePreset.all();

	onMount(async () => {
		await lessonStore.fetchAll();
	})

	const tableCallbacks: TableCallbacks<Lesson> = {
		onRowClick: async (lesson) => {
			await goto(`${ROUTES.ADMIN.LESSON}/${lesson.id}`);
		},

		onAction: async (actionId, lesson) => {
			switch (actionId) {
				case 'view':
					await goto(`${ROUTES.ADMIN.LESSON}/${lesson.id}`);
					break;
				case 'delete':
					const confirmed = await confirmationModal.delete(`Delete Course?`,`Are you sure you want to delete this category?`)
					if (confirmed) {
						try {
							await lessonStore.delete(lesson.id);
						} catch (error) {
							toastService.error('Failed to delete category:',`Operation failed with error: ${error}`);
						}
					}
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
	async function handleValidFormSubmit(data: Partial<Lesson>) {
		try {
			const newLesson = await lessonStore.create(data);
			if (newLesson && newLesson?.id) {
				closeCreateModal();
				toastService.success(`Course Created`,`Lipsum`)
				// TODO: Add notifications notification
			}
		} catch (error) {
			console.error('Failed to create Course:', error);
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
		heading="Terminals"
		subHeading="Organize and manage your users with ease"
	/>

	<!-- Universal Data Table -->
	<UniversalDataTable
		data={lessonStore.data}
		loading={lessonStore.loading}
		error={lessonStore.error}
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
	title="Create Course"
	subtitle="Add a new course"
	icon={FileText}
	iconBgColor="from-indigo-500 to-purple-600"
	loading={lessonStore.creating}
	error={lessonStore.createError}
	submitLabel="Create"
	onclose={closeCreateModal}
	onsubmit={handleModalSubmit}
>
	{#snippet children()}
		<UniversalForm
			bind:this={formRef}
			schema={LessonFormPresets.standard()}
			callbacks={formCallbacks}
			className="space-y-6"
		/>
	{/snippet}
</UniversalCreateModal>