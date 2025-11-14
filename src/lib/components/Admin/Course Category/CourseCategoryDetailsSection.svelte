<script lang="ts">



	import type { CourseCategory } from '$lib/types/entities/CourseCategory';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { CourseCategoryFormPresets } from '$lib/components/Forms/Schemas/CourseCategoryFormSchema';
	import { ROUTES } from '$lib/Config/routes.config';
	import StickyFormHeader from '$lib/components/UI/StickyFormHeader.svelte';
	import { BookIcon } from '@lucide/svelte';
	import MetadataCard, { type MetadataItemConfig } from '$lib/components/Analytics/MetadataCard.svelte';
	import Course from '@lucide/svelte/icons/book';
	import { getCourseStatusColors } from '$lib/Config/UIConstants';


	interface Props {
		courseCategory: CourseCategory;
		onUpdate: (formData: Partial<CourseCategory>) => Promise<void>;
	}
	let { courseCategory, onUpdate }: Props = $props();

	let formRef: UniversalForm;
	let hasFormChanges = $state(false);
	let isFormValid = $state(true);
	let isSaving = $state(false);
	let formErrors = $state<Record<string, string>>({});

	let statusColors = $derived(getCourseStatusColors(status));


	const courseCategoryFormSchema = $derived(CourseCategoryFormPresets.embedded());
	const formInitialData = $derived.by(() => ({
		...courseCategory
	}))

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
		if (!courseCategory) return [];

		return [
			{
				label: 'ID',
				value: courseCategory.id || 0,
				type: 'number',
				canCopy: true
			},
			{
				label: 'UUID',
				value: courseCategory.uuid || '',
				type: 'text',
				canCopy: true
			},

			{
				label: 'Created',
				value: courseCategory.createdAt || 'Never',
				type: courseCategory.createdAt ? 'datetime' : 'text'
			},
			{
				label: 'Created By',
				value: courseCategory.createdBy || 'Not Available',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Last Updated',
				value: courseCategory.updatedAt || 'Never',
				type: courseCategory.updatedAt ? 'datetime' : 'text'
			},
			{
				label: 'Created By',
				value: courseCategory.createdBy || 'Not Available',
				type: 'text',
				canCopy: true
			},
		];
	});

	const courseCategoryFormCallbacks = {
		onSubmit: handleSubmit,
		onChange: (field: string, value: any) => {},
		onValidate: (result: any) => {
			isFormValid = result.isValid;
			formErrors = result.errors || {};
		}
	};

	async function handleSubmit(formData: Partial<CourseCategory>): Promise<void> {
		isSaving = true;

		try {
			await onUpdate(formData);
			formRef?.reset(formData);
			hasFormChanges = false;
		} finally {
			isSaving = false;
		}
	}

</script>


<StickyFormHeader
	title="Edit Station Category"
	subtitle={courseCategory.name}
	backUrl={ROUTES.ADMIN.COURSE_CATEGORIES}
	hasChanges={hasFormChanges}
	isSaving={isSaving}
	isValid={isFormValid}
	errors={formErrors}
	onSave={handleSaveClick}
	onDiscard={handleDiscardClick}
/>

<MetadataCard
	title="Category Metadata"
	subtitle="System information and statistics"
	icon={BookIcon}
	badge={{
      text: `${courseCategory.courses.length || 0} Stations`,
      icon: Course
    }}
	items={metadataItems}
	columns={4}
	gradientFrom={statusColors.from}
	gradientTo={statusColors.to}
/>

<UniversalForm
	bind:this={formRef}
	schema={courseCategoryFormSchema}
	initialData={formInitialData}
	callbacks={courseCategoryFormCallbacks}
	mode="embedded"
	onDirtyChange={(isDirty) => hasFormChanges = isDirty}
/>