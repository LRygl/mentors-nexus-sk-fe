export type DialogVariant = 'destructive' | 'default' | 'info' | 'success' | 'warning' | 'error';
export type DialogType =  'confirmation' | 'notification';

export interface DialogState {
	open: boolean;
	title: string;
	description: string;
	variant: DialogVariant;
	type: DialogType;
	confirmText: string;
	cancelText: string;
	closeText: string;
	isLoading: boolean;
	loadingText: string;
	onConfirm: (() => void | promise<void> | null);
	onCancel: (() => void | promise<void> | null);
	onClose: (() => void | promise<void> | null);
}

export interface ConfirmationOptions {
	title?: string;
	description?: string;
	variant?: DialogVariant;
	confirmText?: string;
	cancelText?: string;
	loadingText?: string;
	onConfirm: (() => void | promise<void> | null);
	onCancel: (() => void | promise<void> | null);
}

export interface DeleteConfirmationOptions {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	loadingText?: string;
	onConfirm?: () => void | Promise<void>;
	onCancel?: () => void | Promise<void>;
}

export interface NotificationOptions {
	title?: string;
	description?: string;
	variant?: DialogVariant;
	closeText?: string;
	onClose?: () => void | Promise<void>;
}

export interface QuickNotificationOptions {
	title?: string;
	description?: string;
	onClose?: () => void | Promise<void>;
}