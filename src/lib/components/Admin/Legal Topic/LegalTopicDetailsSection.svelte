<script lang="ts">

	import type { LegalTopic } from '$lib/types/entities/LegalTopic';
	import { LegalTopicFormPresets } from '$lib/components/Forms/Schemas/LegalTopicFormSchema';
	import { ROUTES } from '$lib/Config/routes.config';
	import { API_CONFIG } from '$lib/API/APIConfiguration';
	import EntityDetailsSection from '$lib/components/EntityDetailsSection.svelte';
	import { getCourseStatusColors } from '$lib/Config/UIConstants';
	import type { MetadataConfig } from '$lib/types/Components/MetadataConfig';
	import { BookIcon } from '@lucide/svelte';
	import type { MetadataItemConfig } from '$lib/components/Analytics/MetadataCard.svelte';

	interface Props {
		topic: LegalTopic;
		onUpdate: (formData: Partial<LegalTopic>) => Promise<void>;
	}

	let { topic, onUpdate }: Props = $props();

	let formSchema = $derived(LegalTopicFormPresets.embedded());
	let statusColors = $derived(getCourseStatusColors('DRAFT'));
	let formInitialData = $derived.by(() => ({
		...topic,
	}));
	let metadata = $derived.by((): MetadataConfig => ({
		title: 'Lesson Metadata',
		subtitle: 'System information and statistics',
		icon: BookIcon,
		columns: 4,
		items: buildMetadataItems()
	}));

	function buildMetadataItems(): MetadataItemConfig[] {
		if (!topic) return [];

		return [
			{
				label: 'ID',
				value: topic.id || 0,
				type: 'number',
				canCopy: true
			},
			{
				label: 'UUID',
				value: topic.uuid || '',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Created',
				value: topic.createdAt || 'Never',
				type: topic.createdAt ? 'datetime' : 'text'
			},
			{
				label: 'Created By',
				value: topic.createdBy || 'Not Available',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Last Updated',
				value: topic.updatedAt || 'Never',
				type: topic.updatedAt ? 'datetime' : 'text'
			},
			{
				label: 'Updated By',
				value: topic.updatedBy || 'Not Available',
				type: 'text',
				canCopy: true,
			}
		];
	}

</script>

<EntityDetailsSection
	entity={topic}
	entityName="Legal Topic"
	formSchema={formSchema}
	{formInitialData}
	backUrl={ROUTES.ADMIN.LESSON}
	{metadata}
	gradientFrom={statusColors.from}
	gradientTo={statusColors.to}
	{onUpdate}
	imageBaseUrl={API_CONFIG.FULL_BASE_URL+API_CONFIG.ENDPOINTS.ADMIN.LESSONS}
/>