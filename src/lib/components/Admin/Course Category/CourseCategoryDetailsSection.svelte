<script lang="ts">
	import type { CourseCategory } from '$lib/types/entities/CourseCategory';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { CourseCategoryFormPresets } from '$lib/components/Forms/Schemas/CourseCategoryFormSchema';
	import { ROUTES } from '$lib/Config/routes.config';
	import StickyFormHeader from '$lib/components/UI/StickyFormHeader.svelte';
	import { BookIcon } from '@lucide/svelte';
	import MetadataCard, { type MetadataItemConfig } from '$lib/components/Analytics/MetadataCard.svelte';
	import { getCourseStatusColors } from '$lib/Config/UIConstants';
	import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
	import {
		CourseTableConfig,
		CourseTablePreset
	} from '$lib/components/Data Table/Configurations/CourseTableConfiguration';
	import { goto } from '$app/navigation';
	import type { TableCallbacks } from '$lib/types/ui/table';
	import type { Course } from '$lib/types/entities/Course';


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
	// Table state
	let selectedItems = $state<Set<string>>(new Set());

	const courseCategoryFormSchema = $derived(CourseCategoryFormPresets.embedded());
	const formInitialData = $derived.by(() => ({
		...courseCategory
	}))


	const tableConfig = CourseTableConfig.embedded();

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

	const tableCallbacks: TableCallbacks<Course> = {
		onRowClick: (course: Course) => {
			// Navigate to course detail page
			goto(`${ROUTES.ADMIN.COURSE}/${course.id}`);
		},
		onAction: async (actionId: string, course: Course) => {
			switch (actionId) {
				case 'view':
					goto(`${ROUTES.ADMIN.COURSE}/${course.id}`);
					break;
				case 'edit':
					goto(`${ROUTES.ADMIN.COURSE}/${course.id}/edit`);
					break;
				case 'delete':
					// Handle removing course from this category
					if (confirm(`Remove "${course.name}" from this category?`)) {
						// Call your API to unlink the course
						console.log('Remove course from category:', course.id);
					}
					break;
			}
		}
	};

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
      icon: BookIcon
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

<!-- ============================================ -->
<!-- LINKED COURSES TABLE                         -->
<!-- ============================================ -->
<div class="mt-8">
	<div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
		<!-- Section Header -->
		<div class="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="p-2 bg-indigo-100 rounded-lg">
						<BookIcon class="w-5 h-5 text-indigo-600" />
					</div>
					<div>
						<h3 class="text-lg font-semibold text-slate-900">Linked Courses</h3>
						<p class="text-sm text-slate-500">
							{courseCategory.courses?.length || 0} courses in this category
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Data Table -->
		<UniversalDataTable
			data={courseCategory.courses || []}
			loading={false}
			error={null}
			config={tableConfig.config}
			columns={tableConfig.columns}
			callbacks={tableCallbacks}
			bind:selectedItems={selectedItems}
			getActions={tableConfig.getActions}
			{...tableConfig.props}
		/>
	</div>
</div>