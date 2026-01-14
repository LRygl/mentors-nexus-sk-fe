import type { Toast, ToastConfig, ToastSettings, ToastVariant, ToastPosition } from '$lib/types/entities/ToastTypes';

// Global reactive state
let toasts = $state<Toast[]>([]);
let settings = $state<ToastSettings>({
	position: 'top-right',
	debugMode: false
});

// Service class (singleton pattern like Spring @Service)
class ToastService {
	// Getters for reactive state
	get toasts() {
		return toasts;
	}

	get settings() {
		return settings;
	}

	/**
	 * Configure global notifications settings
	 */
	configure(newSettings: Partial<ToastSettings>) {
		settings = { ...settings, ...newSettings };
	}

	/**
	 * Set notifications position
	 */
	setPosition(position: ToastPosition) {
		settings.position = position;
	}

	/**
	 * Toggle debug mode
	 */
	setDebugMode(enabled: boolean) {
		settings.debugMode = enabled;
	}

	/**
	 * Show a notifications notification
	 */
	show(config: ToastConfig): string {
		const toast: Toast = {
			id: this.generateId(),
			variant: config.variant || 'default',
			title: config.title,
			message: config.message,
			duration: config.duration ?? this.getDefaultDuration(config.variant || 'default'),
			dismissible: config.dismissible ?? true,
			action: config.action,
			icon: config.icon,
			debugInfo: config.debugInfo,
			createdAt: Date.now()
		};

		// Add to beginning of array (newest first)
		toasts = [toast, ...toasts];

		// Log debug info if debug mode is enabled
		if (settings.debugMode && toast.debugInfo) {
			console.group(`🔍 Toast Debug: ${toast.title}`);
			console.log('Toast Config:', toast);
			console.log('Debug Info:', toast.debugInfo);
			console.groupEnd();
		}

		// Auto-dismiss if duration > 0
		if (toast.duration > 0) {
			setTimeout(() => {
				this.dismiss(toast.id);
			}, toast.duration);
		}

		return toast.id;
	}

	/**
	 * Convenience methods for each variant
	 */
	success(title: string, message: string, config?: Partial<ToastConfig>): string {
		return this.show({
			variant: 'success',
			title,
			message,
			...config
		});
	}

	error(title: string, message: string, config?: Partial<ToastConfig>): string {
		return this.show({
			variant: 'error',
			title,
			message,
			duration: 0, // Errors stay until dismissed by default
			...config
		});
	}

	warning(title: string, message: string, config?: Partial<ToastConfig>): string {
		return this.show({
			variant: 'warning',
			title,
			message,
			...config
		});
	}

	info(title: string, message: string, config?: Partial<ToastConfig>): string {
		return this.show({
			variant: 'info',
			title,
			message,
			...config
		});
	}

	default(title: string, message: string, config?: Partial<ToastConfig>): string {
		return this.show({
			variant: 'default',
			title,
			message,
			...config
		});
	}

	/**
	 * Show HTTP error with debug info
	 */
	httpError(title: string, message: string, httpResponse: any): string {
		return this.error(title, message, {
			debugInfo: {
				status: httpResponse.status,
				statusText: httpResponse.statusText,
				url: httpResponse.url,
				headers: httpResponse.headers,
				body: httpResponse.data || httpResponse.body,
				timestamp: new Date().toISOString()
			}
		});
	}

	/**
	 * Dismiss a specific notifications
	 */
	dismiss(id: string) {
		toasts = toasts.filter(t => t.id !== id);
	}

	/**
	 * Dismiss all toasts
	 */
	dismissAll() {
		toasts = [];
	}

	/**
	 * Get default duration based on variant
	 */
	private getDefaultDuration(variant: ToastVariant): number {
		const durations: Record<ToastVariant, number> = {
			success: 5000,    // 5 seconds
			info: 5000,       // 5 seconds
			warning: 7000,    // 7 seconds
			error: 0,         // Stays forever
			default: 5000     // 5 seconds
		};
		return durations[variant];
	}

	/**
	 * Generate unique ID for notifications
	 */
	private generateId(): string {
		return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}
}

// Export singleton instance
export const toastService = new ToastService();