import { writable } from 'svelte/store';
import type {
	ConfirmationOptions,
	DeleteConfirmationOptions,
	NotificationOptions,
	QuickNotificationOptions,
	DialogState
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


	return {
		subscribe,

		// Confirmation dialogs
		confirm: (options: ConfirmationOptions) => {
			set({
				open: true,
				type: 'confirmation',
				variant: options.variant || 'default',
				title: options.title || 'Confirm Action',
				description: options.description || 'Are you sure you want to proceed?',
				confirmText: options.confirmText || 'Confirm',
				cancelText: options.cancelText || 'Cancel',
				isLoading: false,
				loadingText: options.loadingText || 'Processing...',
				onConfirm: options.onConfirm || null,
				onCancel: options.onCancel || null,
				onClose: null,
				closeText: ''
			});
		},

		// Delete confirmation (shorthand)
		confirmDelete: (options: DeleteConfirmationOptions) => {
			set({
				open: true,
				type: 'confirmation',
				variant: 'destructive',
				title: options.title || 'Delete Item',
				description:
					options.description ||
					'This action cannot be undone. This will permanently delete the item.',
				confirmText: options.confirmText || 'Delete',
				cancelText: options.cancelText || 'Cancel',
				isLoading: false,
				loadingText: options.loadingText || 'Deleting...',
				onConfirm: options.onConfirm || null,
				onCancel: options.onCancel || null,
				onClose: null,
				closeText: ''
			});
		},


		// Notification dialogs
		notify: (options: NotificationOptions) => {
			set({
				open: true,
				type: 'notification',
				variant: options.variant || 'info',
				title: options.title || 'Notification',
				description: options.description || '',
				closeText: options.closeText || 'Close',
				isLoading: false,
				loadingText: '',
				onConfirm: null,
				onCancel: null,
				onClose: options.onClose || null,
				confirmText: '',
				cancelText: ''
			});
		},

		// Shorthand notification methods
		success: (title?: string, description?: string, onClose?: () => void | Promise<void>) => {
			set({
				open: true,
				type: 'notification',
				variant: 'success',
				title: title || 'Success',
				description: description || 'Operation completed successfully.',
				closeText: 'Close',
				isLoading: false,
				loadingText: '',
				onConfirm: null,
				onCancel: null,
				onClose: onClose || null,
				confirmText: '',
				cancelText: ''
			});
		},

		error: (title?: string, description?: string, onClose?: () => void | Promise<void>) => {
			set({
				open: true,
				type: 'notification',
				variant: 'destructive',
				title: title || 'Error',
				description: description || 'An error occurred.',
				closeText: 'Close',
				isLoading: false,
				loadingText: '',
				onConfirm: null,
				onCancel: null,
				onClose: onClose || null,
				confirmText: '',
				cancelText: ''
			});
		},

		warning: (title?: string, description?: string, onClose?: () => void | Promise<void>) => {
			set({
				open: true,
				type: 'notification',
				variant: 'warning',
				title: title || 'Warning',
				description: description || 'Please review this information.',
				closeText: 'Close',
				isLoading: false,
				loadingText: '',
				onConfirm: null,
				onCancel: null,
				onClose: onClose || null,
				confirmText: '',
				cancelText: ''
			});
		},

		info: (title?: string, description?: string, onClose?: () => void | Promise<void>) => {
			set({
				open: true,
				type: 'notification',
				variant: 'info',
				title: title || 'Information',
				description: description || '',
				closeText: 'Close',
				isLoading: false,
				loadingText: '',
				onConfirm: null,
				onCancel: null,
				onClose: onClose || null,
				confirmText: '',
				cancelText: ''
			});
		},

		// Update loading state
		setLoading: (isLoading: boolean) => {
			update(state => ({ ...state, isLoading }));
		},

		// Close dialog
		close: () => {
			update(state => ({ ...state, open: false }));
		},

		// Reset to defaults
		reset: () => {
			set({
				open: false,
				title: '',
				description: '',
				variant: 'default',
				type: 'confirmation',
				confirmText: 'Confirm',
				cancelText: 'Cancel',
				closeText: 'Close',
				isLoading: false,
				loadingText: 'Processing...',
				onConfirm: null,
				onCancel: null,
				onClose: null
			});
		}
	};
}

export const dialogStore = createDialogStore();