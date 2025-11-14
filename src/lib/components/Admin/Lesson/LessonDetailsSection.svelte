<script lang="ts">

	import type { Lesson } from '$lib/types/entities/Lesson';
	import { ROUTES } from '$lib/Config/routes.config';
	import { BookIcon } from '@lucide/svelte';
	import { type MetadataItemConfig } from '$lib/components/Analytics/MetadataCard.svelte';
	import { getCourseStatusColors } from '$lib/Config/UIConstants';
	import EntityDetailsSection from '$lib/components/EntityDetailsSection.svelte';
	import type { MetadataConfig } from '$lib/types/Components/MetadataConfig';
	import { LessonFormPresets } from '$lib/components/Forms/Schemas/LessonFormSchema';
	import { API_CONFIG } from '$lib/API/APIConfiguration';
	import { formatDuration } from '$lib/utils/DurationUtils';
	import { getEntityImageUrl } from '$lib/utils/ImageUtils';

	interface Props {
		lesson: Lesson;
		onUpdate: (formData: Partial<Lesson>, file?: File) => Promise<void>;
	}

	let { lesson, onUpdate }: Props = $props();

	// ============================================================
	// CONFIGURATION SECTION
	// This is where entity-specific logic lives
	// ============================================================

	// 1. Form Schema - defines what fields to show in the form
	let formSchema = $derived(LessonFormPresets.embedded());

	// 2. Form Initial Data - prepares the data for the form
	let formInitialData = $derived.by(() => ({
		...lesson,
		imageUrl: getEntityImageUrl('lesson', lesson.imageUrl ?? null),
		// Add any transformations here, e.g.:
		// categoryIds: lesson.categories?.map(c => c.id),
	}));

	// 3. Styling - gradient colors for the metadata card
	let statusColors = $derived(getCourseStatusColors('DRAFT'));

	// 4. Metadata Configuration - what information to display
	let metadata = $derived.by((): MetadataConfig => ({
		title: 'Lesson Metadata',
		subtitle: 'System information and statistics',
		icon: BookIcon,
		columns: 4,
		items: buildMetadataItems()
	}));


	// ============================================================
	// METADATA BUILDER
	// Converts entity data into displayable metadata items
	// ============================================================
	function buildMetadataItems(): MetadataItemConfig[] {
		if (!lesson) return [];

		return [
			{
				label: 'ID',
				value: lesson.id || 0,
				type: 'number',
				canCopy: true
			},
			{
				label: 'UUID',
				value: lesson.uuid || '',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Created',
				value: lesson.createdAt || 'Never',
				type: lesson.createdAt ? 'datetime' : 'text'
			},
			{
				label: 'Created By',
				value: lesson.createdBy || 'Not Available',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Last Updated',
				value: lesson.updatedAt || 'Never',
				type: lesson.updatedAt ? 'datetime' : 'text'
			},
			{
				label: 'Updated By',
				value: lesson.updatedBy || 'Not Available',
				type: 'text',
				canCopy: true,
			},
			{
				label: 'Duration',
				value: formatDuration(lesson.duration),
				type: 'text',
				subtitle: lesson.duration ? `${lesson.duration} minutes` : undefined
			},
		];
	}

</script>

<EntityDetailsSection
	entity={lesson}
	entityName="Terminal"
	formSchema={formSchema}
	{formInitialData}
	backUrl={ROUTES.ADMIN.LESSON}
	{metadata}
	gradientFrom={statusColors.from}
	gradientTo={statusColors.to}
	{onUpdate}
	imageBaseUrl={API_CONFIG.FULL_BASE_URL+API_CONFIG.ENDPOINTS.ADMIN.LESSONS}
/>