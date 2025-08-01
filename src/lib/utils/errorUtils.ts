// src/lib/utils/errorUtils.ts

/**
 * Extract a readable error message from an unknown error
 */
export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	if (typeof error === 'string') {
		return error;
	}

	if (error && typeof error === 'object' && 'message' in error) {
		return String(error.message);
	}

	return 'An unknown error occurred';
}

/**
 * Log an error with context information
 */
export function logError(context: string, error: unknown, additionalInfo?: Record<string, any>): void {
	const errorMessage = getErrorMessage(error);
	console.error(`❌ ${context}:`, {
		message: errorMessage,
		error,
		...additionalInfo
	});
}

/**
 * Handle API errors with user-friendly messages
 */
export function handleApiError(error: unknown, operation: string): string {
	const baseMessage = getErrorMessage(error);

	// Common API error patterns
	if (baseMessage.includes('Failed to fetch')) {
		return `Network error: Unable to ${operation}. Please check your connection and try again.`;
	}

	if (baseMessage.includes('404')) {
		return `Resource not found. The item you're trying to ${operation} may have been deleted.`;
	}

	if (baseMessage.includes('403') || baseMessage.includes('401')) {
		return `Access denied. You don't have permission to ${operation}.`;
	}

	if (baseMessage.includes('500')) {
		return `Server error occurred while trying to ${operation}. Please try again later.`;
	}

	// Return the original message if no specific pattern matches
	return baseMessage;
}

/**
 * Show error notification to user
 */
export function showErrorNotification(message: string, details?: string): void {
	window.dispatchEvent(new CustomEvent('showError', {
		detail: { message, details }
	}));
}

/**
 * Show success notification to user
 */
export function showSuccessNotification(message: string): void {
	window.dispatchEvent(new CustomEvent('showSuccess', {
		detail: { message }
	}));
}

/**
 * Wrapper for async operations with error handling
 */
export async function withErrorHandling<T>(
	operation: () => Promise<T>,
	context: string,
	showNotification: boolean = true
): Promise<T | null> {
	try {
		return await operation();
	} catch (error) {
		const errorMessage = handleApiError(error, context);
		logError(context, error);

		if (showNotification) {
			showErrorNotification(errorMessage);
		}

		return null;
	}
}

/**
 * Type guard to check if error is an instance of Error
 */
export function isError(error: unknown): error is Error {
	return error instanceof Error;
}

/**
 * Type guard to check if error has a message property
 */
export function hasMessage(error: unknown): error is { message: string } {
	return error !== null &&
		typeof error === 'object' &&
		'message' in error &&
		typeof (error as any).message === 'string';
}