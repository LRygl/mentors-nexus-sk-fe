<script lang="ts">
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import StickyFormHeader from '$lib/components/UI/StickyFormHeader.svelte';
	import MetadataCard, { type MetadataItemConfig } from '$lib/components/Analytics/MetadataCard.svelte';
	import { CourseFormPresets } from '$lib/components/Forms/Schemas/CourseFormSchema';
	import { courseCategoryStore } from '$lib/stores/defaults/CourseCategoryStore';
	import { userStore } from '$lib/stores/defaults/UserStore';
	import type { Course } from '$lib/types/entities/Course';
	import { ROUTES } from '$lib/Config/routes.config';
	import { getEntityImageUrl, prepareEntityDataForSubmit } from '$lib/utils/ImageUtils';
	import type { CourseStatus } from '$lib/types/enums/CourseStatus';
	import { getCourseStatusColors } from '$lib/Config/UIConstants';
	import { BookIcon, User } from '@lucide/svelte';
	import { API_CONFIG } from '$lib/API/APIConfiguration';

	interface Props {
		course: Course;
		onUpdate: (formData: Partial<Course>, imageFile?: File) => Promise<void>;
	}

	let { course, onUpdate }: Props = $props();

	// Local state for form management
	let formRef: UniversalForm;
	let hasFormChanges = $state(false);
	let isFormValid = $state(true);
	let isSaving = $state(false);
	let formErrors = $state<Record<string, string>>({});

	// Use centralized status colors
	let status = $derived(course?.status as CourseStatus ?? CourseStatus.DRAFT);
	let statusColors = $derived(getCourseStatusColors(status));

	// Load dependencies
	let courseCategories = $derived(courseCategoryStore.data);
	let users = $derived(userStore.data);

	// Derive the imageUrl using the utils
	let courseImageUrl = $derived.by(() => {
		if (!course) return null;
		return getEntityImageUrl(`course`, course.imageUrl)
	})

	const courseFormSchema = $derived(
		CourseFormPresets.embedded(courseCategories, users)
	);

	const formInitialData = $derived.by(() => ({
		...course,
		categoryIds: course.categoryIds?.map(id => String(id)),
		ownerId: course.owner?.id,
		imageUrl: courseImageUrl,

	}));

	const courseFormCallbacks = {
		onSubmit: handleSubmit,
		onChange: (field: string, value: any) => {},
		onValidate: (result: any) => {
			isFormValid = result.isValid;
			formErrors = result.errors || {};
		}
	};

	async function handleSubmit(formData: Partial<Course>) {
		isSaving = true;
		try {
			// Data preparation logic
			const { data: cleanData, imageFile } = prepareEntityDataForSubmit(formData);

			// Call parent handler
			await onUpdate(cleanData, imageFile);

			// Reset form state
			formRef?.reset(formData);
			hasFormChanges = false;
		} finally {
			isSaving = false;
		}
	}

	function handleSaveClick() {
		if (formRef && hasFormChanges && isFormValid) {
			formRef.submit();
		}
	}

	function handleDiscardClick() {
		if (formRef && hasFormChanges) {
			if (confirm('Are you sure you want to discard all changes?')) {
				formRef.discard();
				hasFormChanges = false;
			}
		}
	}



	/**
	 * METADATA CONFIGURATION
	 * This is view logic - it defines HOW to display the course data
	 */
	let metadataItems = $derived.by((): MetadataItemConfig[] => {
		if (!course) return [];

		return [
			{
				label: 'ID',
				value: course.id || 0,
				type: 'number',
				canCopy: true
			},
			{
				label: 'UUID',
				value: course.uuid || '',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Status',
				value: course.status || 'DRAFT',
				type: 'text',
				subtitle: getStatusDescription(course.status)
			},
			{
				label: 'Created',
				value: course.created || '',
				type: 'datetime'
			},
			{
				label: 'Last Updated',
				value: course.updated || 'Never',
				type: course.updated ? 'datetime' : 'text'
			},
			{
				label: 'Published',
				value: course.published || 'Not published',
				type: course.published ? 'datetime' : 'text'
			},
		];
	});

	/**
	 * Helper function for status descriptions
	 */
	function getStatusDescription(status: string): string {
		const descriptions: Record<string, string> = {
			'DRAFT': 'Not yet published',
			'PUBLISHED': 'Visible to students',
			'ARCHIVED': 'No longer active',
			'COMING_SOON': 'Preview available'
		};
		return descriptions[status] || '';
	}

</script>

<StickyFormHeader
	title="Edit Terminal"
	subtitle={course.name}
	backUrl={ROUTES.ADMIN.COURSE}
	hasChanges={hasFormChanges}
	isSaving={isSaving}
	isValid={isFormValid}
	errors={formErrors}
	onSave={handleSaveClick}
	onDiscard={handleDiscardClick}
/>

<MetadataCard
	title="Terminal Metadata"
	subtitle="System information and statistics"
	icon={BookIcon}
	badge={{
      text: `${course.students || 0} Students`,
      icon: User
    }}
	items={metadataItems}
	columns={4}
	gradientFrom={statusColors.from}
	gradientTo={statusColors.to}
/>

<UniversalForm
	bind:this={formRef}
	schema={courseFormSchema}
	initialData={formInitialData}
	callbacks={courseFormCallbacks}
	mode="embedded"
	onDirtyChange={(isDirty) => hasFormChanges = isDirty}
	imageBaseUrl={API_CONFIG.FULL_BASE_URL+API_CONFIG.ENDPOINTS.ADMIN.COURSES}
/>