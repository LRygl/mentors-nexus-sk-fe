<script lang="ts">
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { LegalSectionFormSchema } from '$lib/components/Forms/Schemas/Legal/LegalSectionFormSchema';
	import { legalTopicStore } from '$lib/stores/defaults/LegalTopicStore.svelte';
	import type { LegalSection } from '$lib/types/entities/LegalSection';
	import { Link2 } from 'lucide-svelte';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';

	// SImple form without the factory pattern as no dependency is needed

	interface Props {
		isOpen: boolean;
		topicId: string | null;
		onClose: () => void;
		loading?: boolean;
		error?: string | null;
	}

	let {
		isOpen,
		topicId,
		onClose,
		loading = false,
		error = null
	}: Props = $props();

	let formRef: UniversalForm | undefined = $state();

	let isSubmitting = $state(false);
	let formHasChanges = $state(false);
	let isFormValid = $state(false);

	let formSchema = $derived(LegalSectionFormSchema)

	const formCallbacks = {
		onSubmit: handleFormSubmit,
		onValidate: handleFormValidate
	}

	function handleFormValidate(result: { isValid: boolean; errors: Record<string, string> }) {
		isFormValid = result.isValid;
	}

	async function handleFormSubmit(formData: Partial<LegalSection>) {
		if(isSubmitting || !topicId) return;

		isSubmitting = true;

		try {
			console.log("Add Legal Section Form Submitted");
			await legalTopicStore.createSection(topicId, formData);
			formRef?.reset();
			formHasChanges = false;
			onClose();
		} catch (e) {
			console.error(isFormValid, e.message);
		} finally {
			isSubmitting = false;
		}

	}

	function handleModalSubmit(event: Event) {
		event.preventDefault();

		if (!isFormValid || !topicId) {
			return;
		}
		formRef?.submit();
	}


	function handleModalClose() {
		// Check for unsaved changes before closing
		if (formHasChanges && !isSubmitting) {
			const confirmed = confirm('You have unsaved changes. Are you sure you want to close?');
			if (!confirmed) return;
		}

		// Reset form state
		formRef?.reset();
		formHasChanges = false;

		// Call parent's onClose to actually close the modal
		onClose();
	}


	function handleFormDirtyChange(isDirty: boolean) {
		formHasChanges = isDirty;
	}

</script>

<UniversalCreateModal
	isOpen={isOpen}
	title="Add Legal Section"
	subtitle="Create new legal section to organize items"
	icon={Link2}
	iconBgColor="from-purple-500 to-pink-600"
	loading={isSubmitting || loading}
	error={error}
	submitLabel="Add Section"
	cancelLabel="Cancel"
	submitDisabled={!isFormValid || isSubmitting || !topicId}
	onclose={handleModalClose}
	onsubmit={handleModalSubmit}
>
	{#snippet children()}
			<UniversalForm
				bind:this={formRef}
				schema={formSchema}
				callbacks={formCallbacks}
				className="space-y-6"
				onDirtyChange={handleFormDirtyChange}
			/>
	{/snippet}
</UniversalCreateModal>