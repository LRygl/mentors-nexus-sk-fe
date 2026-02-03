<script lang="ts">
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import StickyFormHeader from '$lib/components/UI/StickyFormHeader.svelte';
	import MetadataCard, { type MetadataItemConfig } from '$lib/components/Analytics/MetadataCard.svelte';
	import { CourseFormPresets } from '$lib/components/Forms/Schemas/CourseFormSchema';
	import { courseCategoryStore } from '$lib/stores/defaults/CourseCategoryStore';
	import { userStore } from '$lib/stores/defaults/UserStore';
	import type { Course } from '$lib/types/entities/Course';
	import { ROUTES } from '$lib/Config/routes.config';
	import { getEntityImageUrl } from '$lib/utils/ImageUtils';
	import { CourseStatus } from '$lib/types/enums/CourseStatus';
	import { getCourseStatusColors } from '$lib/Config/UIConstants';
	import { BookIcon, User } from '@lucide/svelte';
	import { API_CONFIG } from '$lib/API/APIConfiguration';
	import EntityDetailsSection from '$lib/components/EntityDetailsSection.svelte';
	import type { MetadataConfig } from '$lib/types/Components/MetadataConfig';

	interface Props {
		course: Course;
		onUpdate: (formData: Partial<Course>, imageFile?: File) => Promise<void>;
	}

	let { course, onUpdate }: Props = $props();

	// Local state for form management
	let formRef: UniversalForm;
	let hasFormChanges = $state(false);
	let isFormValid = $state(true);
	let metadata = $derived.by((): MetadataConfig => ({
		title: 'Lesson Metadata',
		subtitle: 'System information and statistics',
		icon: BookIcon,
		columns: 4,
		items: buildMetadataItems()
	}));

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


	// ============================================================
	// METADATA BUILDER
	// Converts entity data into displayable metadata items
	// ============================================================
	function buildMetadataItems(): MetadataItemConfig[] {
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
				value: course.createdAt || 'Never',
				type: course.createdAt ? 'datetime' : 'text'
			},
			{
				label: 'Created By',
				value: course.createdBy || 'Not Available',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Last Updated',
				value: course.updatedAt || 'Never',
				type: course.updatedAt ? 'datetime' : 'text'
			},
			{
				label: 'Created By',
				value: course.createdBy || 'Not Available',
				type: 'text',
				canCopy: true
			},

			{
				label: 'Owner',
				value: course.owner?.firstName + " " +  course.owner?.lastName || 'Not published',
				subtitle: course.owner?.email,
				type: 'text'
			},
		];
	}

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

<EntityDetailsSection
	entity={course}
	entityName="Terminal"
	formSchema={courseFormSchema}
	{formInitialData}
	backUrl={ROUTES.ADMIN.COURSE}
	{metadata}
	gradientFrom={statusColors.from}
	gradientTo={statusColors.to}
	{onUpdate}
	imageBaseUrl={API_CONFIG.FULL_BASE_URL+API_CONFIG.ENDPOINTS.ADMIN.COURSES}
/>