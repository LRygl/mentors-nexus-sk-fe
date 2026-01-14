<script lang="ts">
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { CourseSectionFormPresets } from '$lib/components/Forms/Schemas/CourseSectionFromSchema';
	import { Link2 } from 'lucide-svelte';
	import type { CourseSection } from '$lib/types/entities/CourseSection';

	/**
	 * Presenter component for creating course sections
	 * Responsible for:
	 * - Managing modal open/close state
	 * - Managing form state and validation
	 * - Emitting events to parent when section is created
	 * - No business logic or API calls
	 */

		// Props
	interface Props {
		isOpen: boolean;
		onCreate: (section: Partial<CourseSection>) => Promise<void>;
		onClose: () => void;
		loading?: boolean;
		error?: string | null;
	}

	let {
		isOpen,
		onCreate,
		onClose,
		loading = false,
		error = null
	}: Props = $props();

	// Form reference to control form actions
	let formRef: UniversalForm;

	// Local UI state
	let isSubmitting = $state(false);
	let formHasChanges = $state(false);
	let isFormValid = $state(false);

	// Form schema
	const schema = CourseSectionFormPresets.standard();

	/**
	 * Form callbacks
	 */
	const formCallbacks = {
		onSubmit: handleFormSubmit,
		onChange: handleFormChange,
		onValidate: handleFormValidate
	};

	/**
	 * Handle form field changes
	 */
	function handleFormChange(field: string, value: any) {
		// You can add field-specific logic here if needed
		// For example, auto-generating a slug from title
		if (field === 'title' && value) {
			// Could auto-populate description or orderIndex
		}
	}

	/**
	 * Handle form validation
	 */
	function handleFormValidate(result: { isValid: boolean; errors: Record<string, string> }) {
		isFormValid = result.isValid;
	}

	/**
	 * Handle form submission
	 * This is called when the form data is validated
	 */
	async function handleFormSubmit(sectionData: Partial<CourseSection>) {
		if (isSubmitting) return; // Prevent duplicate submissions

		isSubmitting = true;
		try {
			// Delegate to parent - parent handles the actual API call
			await onCreate(sectionData);

			// Reset form after successful creation
			formRef?.reset();
			formHasChanges = false;
		} catch (error) {
			console.error('[CreateSectionModal] Error creating section:', error);
			// Error handling is done in parent/service layer
		} finally {
			isSubmitting = false;
		}
	}

	/**
	 * Handle modal close
	 * Ensures form is reset and user is warned if there are unsaved changes
	 */
	function handleClose() {
		// Warn user if they have unsaved changes
		if (formHasChanges) {
			const confirmed = confirm('You have unsaved changes. Are you sure you want to close?');
			if (!confirmed) return;
		}

		// Reset form state
		formRef?.reset();
		formHasChanges = false;

		// Notify parent to close modal
		onClose();
	}

	/**
	 * Handle modal submit button click
	 * Triggers form validation and submission
	 */
	function handleModalSubmit(event: Event) {
		event.preventDefault();

		if (!isFormValid) {
			console.warn('[CreateSectionModal] Form is not valid');
			return;
		}

		// Trigger form submission
		formRef?.submit();
	}

	/**
	 * Track form dirty state
	 */
	function handleFormDirtyChange(isDirty: boolean) {
		formHasChanges = isDirty;
	}
</script>

<UniversalCreateModal
	isOpen={isOpen}
	title="Create Terminal Section"
	subtitle="Add a new section to organize your lessons"
	icon={Link2}
	iconBgColor="from-blue-500 to-indigo-600"
	loading={isSubmitting || loading}
	error={error}
	submitLabel="Create Section"
	cancelLabel="Cancel"
	submitDisabled={!isFormValid || isSubmitting}
	onclose={handleClose}
	onsubmit={handleModalSubmit}
>
	{#snippet children()}
		<UniversalForm
			bind:this={formRef}
			schema={schema}
			callbacks={formCallbacks}
			className="space-y-6"
			onDirtyChange={handleFormDirtyChange}
		/>
	{/snippet}
</UniversalCreateModal>

<style>
    /* Add any modal-specific styles here if needed */
</style>