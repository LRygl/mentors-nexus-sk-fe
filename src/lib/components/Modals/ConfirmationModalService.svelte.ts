// $lib/services/ConfirmationModalService.svelte.ts
// This is a Svelte 5 runes-based service (similar to a Spring @Service)

import { messages } from '$lib/i18n/messages';

export type ConfirmVariant = 'confirm' | 'success' | 'warning' | 'error' | 'info' | `delete` ;

export interface ConfirmConfig {
	variant?: ConfirmVariant;
	title: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	showCancel?: boolean;
	icon?: string; // Optional custom icon override
}

interface ConfirmState extends ConfirmConfig {
	isOpen: boolean;
	resolve?: (value: boolean) => void;
}

// Global reactive state using Svelte 5 runes
let state = $state<ConfirmState>({
	isOpen: false,
	variant: 'confirm',
	title: '',
	message: '',
	confirmLabel: messages.buttons.default.confirm.confirm,
	cancelLabel: messages.buttons.default.confirm.cancel,
	showCancel: true
});

// Service class (like a Spring @Service bean)
class ConfirmationModalService {
	// Getter to access reactive state
	get state() {
		return state;
	}

	/**
	 * Opens confirmation modal and returns a Promise
	 * Similar to how you might return CompletableFuture in Spring Boot
	 */
	confirm(config: ConfirmConfig): Promise<boolean> {
		return new Promise((resolve) => {
			state = {
				...config,
				isOpen: true,
				confirmLabel: config.confirmLabel || this.getDefaultConfirmLabel(config.variant || 'confirm'),
				cancelLabel: config.cancelLabel || messages.buttons.default.confirm.cancel,
				showCancel: config.showCancel ?? true,
				resolve
			};
		});
	}

	/**
	 * Convenience methods for each variant (similar to static factory methods)
	 */
	success(title: string, message: string, confirmLabel = 'OK'): Promise<boolean> {
		return this.confirm({
			variant: 'success',
			title,
			message,
			confirmLabel,
			showCancel: false
		});
	}

	error(title: string, message: string, confirmLabel = 'OK'): Promise<boolean> {
		return this.confirm({
			variant: 'error',
			title,
			message,
			confirmLabel,
			showCancel: false
		});
	}

	warning(title: string, message: string, confirmLabel = 'Proceed', cancelLabel = 'Cancel'): Promise<boolean> {
		return this.confirm({
			variant: 'warning',
			title,
			message,
			confirmLabel,
			cancelLabel,
			showCancel: true
		});
	}

	info(title: string, message: string, confirmLabel = 'OK'): Promise<boolean> {
		return this.confirm({
			variant: 'info',
			title,
			message,
			confirmLabel,
			showCancel: false
		});
	}

	delete(title: string, message: string): Promise<boolean> {
		return this.confirm({
			variant: 'error',
			title,
			message,
			confirmLabel: messages.buttons.default.confirm.confirm,
			cancelLabel: messages.buttons.default.confirm.cancel,
			showCancel: true
		});
	}

	/**
	 * Called when user confirms
	 */
	handleConfirm() {
		if (state.resolve) {
			state.resolve(true);
		}
		this.close();
	}

	/**
	 * Called when user cancels
	 */
	handleCancel() {
		if (state.resolve) {
			state.resolve(false);
		}
		this.close();
	}

	/**
	 * Close modal
	 */
	close() {
		state = {
			...state,
			isOpen: false,
			resolve: undefined
		};
	}

	/**
	 * Get default button label based on variant
	 */
	private getDefaultConfirmLabel(variant: ConfirmVariant): string {
		const labels: Record<ConfirmVariant, string> = {
			confirm: messages.buttons.default.confirm.confirm,
			success: messages.buttons.default.confirm.success,
			error: messages.buttons.default.confirm.error,
			warning: messages.buttons.default.confirm.warning,
			info: messages.buttons.default.confirm.info,
			delete: messages.buttons.default.confirm.delete
		};
		return labels[variant];
	}
}

// Export singleton instance (like a Spring @Bean)
export const confirmationModal = new ConfirmationModalService();