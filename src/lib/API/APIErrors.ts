/**
 * Represents the standardized error response from the backend API.
 * This matches the Spring Boot error response structure.
 */
export interface ApiErrorResponse {
	httpTimestamp: string;
	httpStatusCode: number;
	httpStatus: string;
	applicationErrorCode: string;
	applicationErrorMessage: string;
}

/**
 * Type guard to check if an object is an ApiErrorResponse
 */
export function isApiErrorResponse(obj: unknown): obj is ApiErrorResponse {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'httpStatusCode' in obj &&
		'applicationErrorCode' in obj &&
		'applicationErrorMessage' in obj
	);
}

/**
 * Parses an error and returns the user-friendly message.
 * Uses the backend's applicationErrorMessage directly.
 */
export function parseApiError(error: unknown): string {
	// Handle our structured API error response
	if (isApiErrorResponse(error)) {
		return error.applicationErrorMessage;
	}

	// Handle standard Error objects
	if (error instanceof Error) {
		if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
			return 'Unable to connect to the server. Please check your internet connection.';
		}
		return error.message;
	}

	// Handle string errors
	if (typeof error === 'string') {
		return error;
	}

	return 'An unexpected error occurred. Please try again.';
}

/**
 * Extracts the error code from an API error (useful for conditional logic like field highlighting)
 */
export function getErrorCode(error: unknown): string | null {
	if (isApiErrorResponse(error)) {
		return error.applicationErrorCode;
	}
	return null;
}

/**
 * Checks if the error is a specific application error code
 */
export function isErrorCode(error: unknown, code: string): boolean {
	return getErrorCode(error) === code;
}
