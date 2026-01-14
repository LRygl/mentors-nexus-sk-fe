<script lang="ts" generics="TEntity">

	import type { FormSchema } from '$lib/types/entities/forms';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import MetadataCard from '$lib/components/Analytics/MetadataCard.svelte';
	import StickyFormHeader from '$lib/components/UI/StickyFormHeader.svelte';
	import type { MetadataConfig } from '$lib/types/Components/MetadataConfig';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import { confirmationModal } from '$lib/components/Modals/ConfirmationModalService.svelte';
	import { onMount } from 'svelte';

	interface Props {
		// Base entity
		entity: TEntity;
		entityName: string;

		// Form schema configuration
		formSchema: FormSchema;
		formInitialData: any;

		// Navigation
		backUrl: string;

		// Metadata configuration - now simplified!
		metadata: MetadataConfig;

		// Style gradient colors
		gradientFrom: string;
		gradientTo: string;

		// Callbacks
		onUpdate: (formData: Partial<TEntity>, file?: File) => Promise<void>;

		// Optional file handling
		imageBaseUrl?: string;
	}

	let {
		entity,
		entityName,
		formSchema,
		formInitialData,
		backUrl,
		metadata,
		gradientFrom,
		gradientTo,
		onUpdate,
		imageBaseUrl,
	}: Props = $props();

	// Local state for form management
	let formRef: UniversalForm;
	let hasFormChanges = $state(false);
	let isFormValid = $state(true);
	let isSaving = $state(false);
	let formErrors = $state<Record<string, string>>({});

	const formCallbacks = {
		onSubmit: handleSubmit,
		onChange: (field: string, value: any) => {},
		onValidate: (result: any) => {
			isFormValid = result.isValid;
			formErrors = result.errors || {};
		}
	};

	async function handleSubmit(formData: Partial<TEntity>, imageFile?: File) {
		isSaving = true;
		try {
			await onUpdate(formData, imageFile);
			toastService.success(`${entityName} Updated`,`${entityName} sucessfully updated with new information.`);
			formRef?.reset(formData);
			hasFormChanges = false;
		} finally {
			isSaving = false;
		}
	}

	function handleSaveClick() {
		if (formRef && hasFormChanges && isFormValid) {
			formRef.submit();
		}
	}

	async function handleDiscardClick() {
		if (formRef && hasFormChanges) {
			const confirmed = await confirmationModal.warning("Are you sure you want to discard your changes?","All changes in the form will be removed")
			if (confirmed ) {
				formRef.discard();
				hasFormChanges = false;
			}
		}
	}

	// Get the display name for the entity (could be 'name', 'title', etc.)
	let entityDisplayName = $derived(
		(entity as any).name || (entity as any).title || 'Unnamed'
	);

</script>

<StickyFormHeader
	title={`Edit ${entityName}`}
	subtitle={entityDisplayName}
	{backUrl}
	hasChanges={hasFormChanges}
	{isSaving}
	isValid={isFormValid}
	errors={formErrors}
	onSave={handleSaveClick}
	onDiscard={handleDiscardClick}
/>

<MetadataCard
	title={`${entityName} Metadata`}
	subtitle={metadata.subtitle}
	icon={metadata.icon}
	badge={metadata.badge}
	items={metadata.items}
	columns={metadata.columns ?? 4}
	{gradientFrom}
	{gradientTo}
/>

<UniversalForm
	bind:this={formRef}
	schema={formSchema}
	initialData={formInitialData}
	callbacks={formCallbacks}
	mode="embedded"
	onDirtyChange={(isDirty) => hasFormChanges = isDirty}
	{imageBaseUrl}
/>
