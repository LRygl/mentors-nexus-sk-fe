import { writable } from 'svelte/store';
import type {
	DialogStore,
	ConfirmationOptions,
	DeleteConfirmationOptions,
	NotificationOptions,
	QuickNotificationOptions
} from '$lib/types/dialog';

function createDialogStore() {
	const { subscribe, set, update } = writable<DialogState>({
		open: false,
		title: '',
		description: '',
		variant: 'default',
		type: 'confirmation',
		confirmText: 'Confirm',
		cancelText: 'Cancel',
		closeText: 'Close',
		isLoading: false,
		loadingText: 'Loading...',
		onConfirm: null,
		onCancel: null,
		onClose: null,
	});
}

return {
	subscribe,


}