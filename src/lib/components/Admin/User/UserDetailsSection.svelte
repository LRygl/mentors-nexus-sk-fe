<script lang="ts">

	import type { User } from '$lib/types/entities/User';
	import { ROUTES } from '$lib/Config/routes.config';
	import { API_CONFIG } from '$lib/API/APIConfiguration';
	import EntityDetailsSection from '$lib/components/EntityDetailsSection.svelte';
	import { getCourseStatusColors } from '$lib/Config/UIConstants';
	import type { MetadataConfig } from '$lib/types/Components/MetadataConfig';
	import { BookIcon } from '@lucide/svelte';
	import { UserFormPresets } from '$lib/components/Forms/Schemas/User/UserFormSchema';
	import type { MetadataItemConfig } from '$lib/components/Analytics/MetadataCard.svelte';

	interface Props {
		topic: User;
		onUpdate: (formData: Partial<User>) => Promise<void>;
	}

	let { topic, onUpdate }: Props = $props();

	let formSchema = $derived(UserFormPresets.embedded());
	let statusColors = $derived(getCourseStatusColors('DRAFT'));
	let formInitialData = $derived.by(() => ({
		...topic,
	}));
	let metadata = $derived.by((): MetadataConfig => ({
		title: 'User Metadata',
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
				label: 'Role',
				value: topic.role || '',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Active',
				value: topic.isAccountNonLocked || '',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Last Login',
				value: topic.lastLoginDateDisplay || '',
				type: 'datetime',
				canCopy: true
			},
			{
				label: 'Register Date',
				value: topic.registerDate || '',
				type: 'datetime',
				canCopy: true
			},

		];
	}


</script>

<EntityDetailsSection
	entity={topic}
	entityName="User"
	formSchema={formSchema}
	{formInitialData}
	backUrl={ROUTES.ADMIN.LESSON}
	{metadata}
	gradientFrom={statusColors.from}
	gradientTo={statusColors.to}
	{onUpdate}
	imageBaseUrl={API_CONFIG.FULL_BASE_URL+API_CONFIG.ENDPOINTS.ADMIN.USER}
/>

Enrolled Courses
<pre>
</pre>
<br/><br/>

Invoices