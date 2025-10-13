export type ToastVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

export type ToastPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

export interface ToastAction {
	label: string;
	onClick: () => void;
}

export interface ToastConfig {
	variant?: ToastVariant;
	title: string;
	message: string;
	duration?: number; // milliseconds, 0 = stays forever
	dismissible?: boolean;
	action?: ToastAction;
	icon?: string; // Optional custom icon override
	debugInfo?: any; // Additional debug information
}

export interface Toast extends ToastConfig {
	id: string;
	variant: ToastVariant;
	duration: number;
	dismissible: boolean;
	createdAt: number;
}

export interface ToastSettings {
	position: ToastPosition;
	debugMode: boolean;
}