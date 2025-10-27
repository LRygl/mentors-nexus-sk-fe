<script lang="ts">
	import { onMount } from 'svelte';
	import { CourseTablePreset } from '$lib/components/Data Table/Configurations/CourseTableConfiguration';
	import type { TableCallbacks } from '$lib/types/ui/table';
	import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
	import AdminHeaderSection from '$lib/components/Sections/Admin/AdminHeaderSection.svelte';
	import { courseStore } from '$lib/stores/defaults/CourseStore';
	import type { Course } from '$lib/types/entities/Course';
	import { FileText } from 'lucide-svelte';
	import { courseCategoryStore } from '$lib/stores/defaults/CourseCategoryStore';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { CourseFormPresets } from '$lib/components/Forms/Schemas/CourseFormSchema';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import { ROUTES } from '$lib/Config/routes.config';
	import { goto } from '$app/navigation';
	import { confirmationModal } from '$lib/components/Modals/ConfirmationModalService.svelte';

	let selectedItems = $state<Set<string>>(new Set);
	let isCreateModalOpen = $state<boolean>(false);
	let formRef: any;

	const tableConfig = CourseTablePreset.all();

	onMount(async () => {
		await courseStore.fetchAll()
		console.log(courseStore.data);
	})

	const tableCallbacks: TableCallbacks<Course> = {
		onRowClick: async (course) => {
			await goto(`${ROUTES.ADMIN.COURSE}/${course.id}`);
		},

		onAction: async (actionId, course) => {
			if(!course.id) return;

			switch (actionId) {
				case 'view':
					await goto(`${ROUTES.ADMIN.COURSE}/${course.id}`);
					break;
				case 'delete':
					const confirmed = await confirmationModal.delete(`Delete Course?`,`Are you sure you want to delete this course?`)
					if (confirmed) {
						try {
							await courseStore.delete(String(course.id));
							toastService.success('Course deleted successfully',"");
						} catch (error) {
							toastService.error('Failed to delete course:', `${error}`);
						}
					}
					break;
			}
		},

		onCreate: () => {
			console.log('[PAGE] Creating new course');
			createModal();
		}
	}

	/*
* MODAL ACTION HANDLING
*/
	async function createModal() {
		if (courseCategoryStore.data.length === 0) {
			await courseCategoryStore.fetchAll();
		}
		isCreateModalOpen = true;
	}

	function closeCreateModal() {
		isCreateModalOpen = false;
		formRef?.reset();
	}

	// Called when form validation passes
	async function handleValidFormSubmit(data: Partial<Course>) {
		try {
			const newCourseCategory = await courseStore.create(data);
			if (newCourseCategory && newCourseCategory?.id) {
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
		heading="Stations"
		subHeading="Organize and manage your users with ease"
	/>

	<!-- Universal Data Table -->
	<UniversalDataTable
		data={courseStore.data}
		loading={courseStore.loading}
		error={courseStore.error}
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
	loading={courseStore.creating}
	error={courseStore.createError}
	submitLabel="Create"
	onclose={closeCreateModal}
	onsubmit={handleModalSubmit}
>
	{#snippet children()}
		<UniversalForm
			bind:this={formRef}
			schema={CourseFormPresets.standard(courseCategoryStore.data)}
			callbacks={formCallbacks}
			className="space-y-6"
		/>
	{/snippet}
</UniversalCreateModal>