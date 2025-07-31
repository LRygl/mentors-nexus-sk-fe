<!-- GlobalDialog.svelte -->
<script lang="ts">
	import ConfirmationDialog from './confirmation-dialog.svelte';
	import { dialogStore } from '$lib/stores/dialog-store';

	$: dialog = $dialogStore;

	async function handleConfirm(): Promise<void> {
		if (!dialog.onConfirm) return;

		// Use your store's setLoading method
		dialogStore.setLoading(true);

		try {
			await dialog.onConfirm();
			// Use your store's close method
			dialogStore.close();
		} catch (error) {
			console.error('Confirmation failed:', error);
			// Reset loading state on error, keep dialog open
			dialogStore.setLoading(false);
		}
	}

	async function handleCancel(): Promise<void> {
		if (dialog.onCancel) {
			await dialog.onCancel();
		}
		dialogStore.close();
	}

	async function handleClose(): Promise<void> {
		if (dialog.onClose) {
			await dialog.onClose();
		}
		dialogStore.close();
	}
</script>

<ConfirmationDialog
	bind:open={dialog.open}
	title={dialog.title}
	description={dialog.description}
	variant={dialog.variant}
	type={dialog.type}
	confirmText={dialog.confirmText}
	cancelText={dialog.cancelText}
	closeText={dialog.closeText}
	isLoading={dialog.isLoading}
	loadingText={dialog.loadingText}
	on:confirm={handleConfirm}
	on:cancel={handleCancel}
	on:close={handleClose}
/>