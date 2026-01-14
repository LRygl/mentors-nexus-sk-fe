<script lang="ts">
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { CourseLinkFormPresets } from '$lib/components/Forms/Schemas/CourseLinkLessonSchema';
	import { Link2 } from 'lucide-svelte';
	import type { LegalTopic } from '$lib/types/entities/LegalTopic';

	interface Props {
		isOpen: boolean;
		sectionId: string | null;
		availableTopics: LegalTopic[];
		onLink: (sectionId: string, topicId: string) => Promise<void>;
		onClose: () => void;
		loading?: boolean;
		error?: string | null;
	}

	let {
		isOpen,
		sectionId,
		availableTopics,
		onLink,
		onClose,
		loading = false,
		error = null
	}: Props = $props();

	// Form reference
	let formRef: UniversalForm;

	// Local UI state
	let isSubmitting = $state(false);
	let formHasChanges = $state(false);
	let isFormValid = $state(false);

	// Form schema - dynamically updated with available lessons
	let formSchema = $derived(CourseLinkFormPresets.link(availableTopics));

	const formCallbacks = {
		onSubmit: handleFormSubmit,
		onChange: handleFormChange,
		onValidate: handleFormValidate
	};

	function handleFormChange(field: string, value: any) {
		// Handle field changes if needed
	}

	function handleFormValidate(result: { isValid: boolean; errors: Record<string, string> }) {
		isFormValid = result.isValid;
	}

	async function handleFormSubmit(formData: { lessonId: string; orderIndex?: number }) {
		if (isSubmitting || !sectionId) return;

		isSubmitting = true;
		try {
			await onLink(sectionId, formData.lessonId);

			// Reset form after successful linking
			formRef?.reset();
			formHasChanges = false;
		} catch (error) {
			console.error('[LinkLessonModal] Error linking lesson:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function handleClose() {
		if (formHasChanges) {
			const confirmed = confirm('You have unsaved changes. Are you sure you want to close?');
			if (!confirmed) return;
		}

		formRef?.reset();
		formHasChanges = false;
		onClose();
	}

	function handleModalSubmit(event: Event) {
		event.preventDefault();

		if (!isFormValid || !sectionId) {
			return;
		}

		formRef?.submit();
	}

	function handleFormDirtyChange(isDirty: boolean) {
		formHasChanges = isDirty;
	}
</script>

<UniversalCreateModal
	isOpen={isOpen}
	title="Link Item"
	subtitle="Select a legal item to add to this section"
	icon={Link2}
	iconBgColor="from-purple-500 to-pink-600"
	loading={isSubmitting || loading}
	error={error}
	submitLabel="Link Item"
	cancelLabel="Cancel"
	submitDisabled={!isFormValid || isSubmitting || !sectionId}
	onclose={handleClose}
	onsubmit={handleModalSubmit}
>
	{#snippet children()}
		{#if !sectionId}
			<div class="text-red-600 p-4 bg-red-50 rounded-md">
				<p class="font-medium">Error: No section selected</p>
				<p class="text-sm mt-1">Please select a section before linking a lesson.</p>
			</div>
		{:else if availableTopics.length === 0}
			<div class="text-amber-600 p-4 bg-amber-50 rounded-md">
				<p class="font-medium">No lessons available</p>
				<p class="text-sm mt-1">All lessons are already linked or no lessons exist.</p>
			</div>
		{:else}
			<UniversalForm
				bind:this={formRef}
				schema={formSchema}
				callbacks={formCallbacks}
				className="space-y-6"
				onDirtyChange={handleFormDirtyChange}
			/>
		{/if}
	{/snippet}
</UniversalCreateModal>