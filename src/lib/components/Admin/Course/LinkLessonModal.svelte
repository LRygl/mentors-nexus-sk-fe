<script lang="ts">
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { CourseLinkFormPresets } from '$lib/components/Forms/Schemas/CourseLinkLessonSchema';
	import { Link2 } from 'lucide-svelte';
	import type { Lesson } from '$lib/types/entities/Lesson';

	/**
	 * Presenter component for linking lessons to sections
	 */

		// Props
	interface Props {
		isOpen: boolean;
		sectionId: string | null;
		availableLessons: Lesson[];
		onLink: (sectionId: string, lessonId: string) => Promise<void>;
		onClose: () => void;
		loading?: boolean;
		error?: string | null;
	}

	let {
		isOpen,
		sectionId,
		availableLessons,
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
	let schema = $derived(CourseLinkFormPresets.link(availableLessons));

	/**
	 * Form callbacks
	 */
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

	/**
	 * Handle form submission
	 */
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

	/**
	 * Handle modal close
	 */
	function handleClose() {
		if (formHasChanges) {
			const confirmed = confirm('You have unsaved changes. Are you sure you want to close?');
			if (!confirmed) return;
		}

		formRef?.reset();
		formHasChanges = false;
		onClose();
	}

	/**
	 * Handle modal submit
	 */
	function handleModalSubmit(event: Event) {
		event.preventDefault();

		if (!isFormValid || !sectionId) {
			console.warn('[LinkLessonModal] Form is not valid or section ID is missing');
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
	title="Link Lesson to Section"
	subtitle="Select a lesson to add to this section"
	icon={Link2}
	iconBgColor="from-purple-500 to-pink-600"
	loading={isSubmitting || loading}
	error={error}
	submitLabel="Link Lesson"
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
		{:else if availableLessons.length === 0}
			<div class="text-amber-600 p-4 bg-amber-50 rounded-md">
				<p class="font-medium">No lessons available</p>
				<p class="text-sm mt-1">All lessons are already linked or no lessons exist.</p>
			</div>
		{:else}
			<UniversalForm
				bind:this={formRef}
				schema={schema}
				callbacks={formCallbacks}
				className="space-y-6"
				onDirtyChange={handleFormDirtyChange}
			/>
		{/if}
	{/snippet}
</UniversalCreateModal>