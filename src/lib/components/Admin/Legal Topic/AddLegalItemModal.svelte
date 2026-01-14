<script lang="ts">
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import type { LegalSection } from '$lib/types/entities/LegalSection';
	import { Link2 } from 'lucide-svelte';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import { LegalItemFormPresets } from '$lib/components/Forms/Schemas/Legal/LegalItemFormSchema';
	import { legalTopicStore } from '$lib/stores/defaults/LegalTopicStore.svelte';

	interface Props {
		isOpen: boolean;
		sectionId?: string | null;
		parentItemId?: string | null;
		onClose: () => void;
		loading?: boolean;
		error?:  string | null;
	}

	let {
		isOpen,
		sectionId = null,
		parentItemId = null,
		onClose,
		loading = false,
		error = null,
	}: Props = $props();

	let formRef: UniversalForm | undefined = $state();
	let isSubmitting = $state(false);
	let formHasChanges = $state(false);
	let isFormValid = $state(false);

	// Determine if we're creating a sub-item or a regular item
	let isCreatingSubItem = $derived(!!parentItemId);

	// Derive the title and subtitle based on context
	let modalTitle = $derived(isCreatingSubItem ? 'Add Sub-Item' : 'Add Legal Item');
	let modalSubtitle = $derived(
		isCreatingSubItem
			? 'Create new sub-item under parent item'
			: 'Create new item inside section'
	);


	let formSchema = $derived(LegalItemFormPresets.create());

	const formCallbacks = {
		onSubmit: handleFormSubmit,
		onValidate: handleFormValidate
	}
	function handleFormValidate(result: { isValid: boolean; errors: Record<string, string> }) {
		isFormValid = result.isValid;
	}
	async function handleFormSubmit(formData: Partial<LegalSection>) {
		if (isSubmitting || (!sectionId && !parentItemId)) return;

		isSubmitting = true;

		try {
			if (isCreatingSubItem && parentItemId) {
				// Creating a sub-item under a parent item
				console.log("Add Sub-Item to Parent Item", parentItemId);
				await legalTopicStore.createSubItem(parentItemId, formData);
			} else if (sectionId) {
				// Creating a regular item in a section
				console.log("Add Item to Legal Section", sectionId);
				await legalTopicStore.createItem_InSection(sectionId, formData);
			}

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

		// Validate we have either sectionId or parentItemId
		if (!isFormValid || (!sectionId && !parentItemId)) {
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
	title={modalTitle}
	subtitle={modalSubtitle}
	icon={Link2}
	iconBgColor="from-purple-500 to-pink-600"
	loading={isSubmitting || loading}
	error={error}
	submitLabel="Add Section"
	cancelLabel="Cancel"
	submitDisabled={!isFormValid || isSubmitting || !sectionId}
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