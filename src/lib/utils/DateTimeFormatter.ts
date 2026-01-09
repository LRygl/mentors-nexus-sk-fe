export class DateFormatter {

	/**
	 * Converts date values to ISO-8601 Instant format for backend compatibility
	 * Input: Date object, date string (YYYY-MM-DD), or existing ISO string
	 * Output: ISO-8601 instant string (2026-01-07T00:00:00.000Z)
	 */
	static toISOInstant(value: unknown): string | null {
		if (!value) return null;

		// Already an ISO string with time component
		if (typeof value === 'string' && value.includes('T')) {
			return value;
		}

		// Date object
		if (value instanceof Date) {
			return value.toISOString();
		}

		// Date string without time (YYYY-MM-DD) - add time component
		if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
			return `${value}T00:00:00.000Z`;
		}

		// Return as-is if we can't parse it
		return String(value);
	}

	/**
	 * Converts ISO instant to date string for HTML form inputs
	 * Input: ISO-8601 instant string or Date object
	 * Output: YYYY-MM-DD string for <input type="date">
	 */
	static toDateInputValue(value: unknown): string {
		if (!value) return '';

		if (value instanceof Date) {
			return value.toISOString().split('T')[0];
		}

		if (typeof value === 'string') {
			// If it's an ISO string, extract just the date part
			if (value.includes('T')) {
				return value.split('T')[0];
			}
			// Already a date string
			if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
				return value;
			}
		}

		return '';
	}

	/**
	 * Converts ISO instant to datetime-local input value
	 * Input: ISO-8601 instant string
	 * Output: YYYY-MM-DDTHH:MM string for <input type="datetime-local">
	 */
	static toDateTimeInputValue(value: unknown): string {
		if (!value) return '';

		if (value instanceof Date) {
			return value.toISOString().slice(0, 16);
		}

		if (typeof value === 'string' && value.includes('T')) {
			return value.slice(0, 16);
		}

		return '';
	}

	/**
	 * Common date field name patterns for auto-detection
	 */
	private static readonly DATE_FIELD_PATTERNS = [
		/date$/i,           // endsDate, publishedDate, etc.
		/At$/i,             // createdAt, updatedAt, publishedAt, etc.
		/time$/i,           // startTime, endTime
		/^(start|end|from|to|published|created|updated|expired|valid)/i
	];

	/**
	 * Check if a field name looks like a date field
	 */
	static isDateFieldName(fieldName: string): boolean {
		return this.DATE_FIELD_PATTERNS.some(pattern => pattern.test(fieldName));
	}

	/**
	 * Check if a value looks like a date-only string (YYYY-MM-DD)
	 */
	static isDateOnlyString(value: unknown): boolean {
		return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
	}

	/**
	 * Check if a value looks like an ISO instant string
	 */
	static isISOInstantString(value: unknown): boolean {
		return typeof value === 'string' && value.includes('T') && /^\d{4}-\d{2}-\d{2}T/.test(value);
	}

	/**
	 * Recursively transforms all date fields in an object to ISO-8601 Instant format
	 * Use before sending data to Spring Boot backend
	 *
	 * @param data - Object to transform
	 * @param dateFields - Optional explicit list of field names to transform
	 */
	static transformForApi<T extends Record<string, any>>(
		data: T,
		dateFields?: string[]
	): T {
		if (!data || typeof data !== 'object') return data;

		const result = { ...data };

		for (const [key, value] of Object.entries(result)) {
			if (value === null || value === undefined) continue;

			// Check if this field should be transformed
			const shouldTransform =
				dateFields?.includes(key) ||
				this.isDateFieldName(key) ||
				this.isDateOnlyString(value);

			if (shouldTransform && value) {
				(result as any)[key] = this.toISOInstant(value);
			}

			// Recursively handle nested objects (but not arrays or Date objects)
			else if (
				typeof value === 'object' &&
				!Array.isArray(value) &&
				!(value instanceof Date)
			) {
				(result as any)[key] = this.transformForApi(value, dateFields);
			}

			// Handle arrays of objects
			else if (Array.isArray(value)) {
				(result as any)[key] = value.map(item =>
					typeof item === 'object' && item !== null
						? this.transformForApi(item, dateFields)
						: item
				);
			}
		}

		return result;
	}

	/**
	 * Recursively transforms all date fields from API response to form-friendly format
	 * Use after receiving data from Spring Boot backend
	 *
	 * @param data - Object to transform
	 */
	static transformFromApi<T extends Record<string, any>>(data: T): T {
		if (!data || typeof data !== 'object') return data;

		const result = { ...data };

		for (const [key, value] of Object.entries(result)) {
			if (value === null || value === undefined) continue;

			// Check if this looks like a date field with ISO instant value
			const isDateField = this.isDateFieldName(key);
			const isISOInstant = this.isISOInstantString(value);

			if (isDateField && isISOInstant) {
				(result as any)[key] = this.toDateInputValue(value);
			}

			// Recursively handle nested objects
			else if (
				typeof value === 'object' &&
				!Array.isArray(value) &&
				!(value instanceof Date)
			) {
				(result as any)[key] = this.transformFromApi(value);
			}

			// Handle arrays of objects
			else if (Array.isArray(value)) {
				(result as any)[key] = value.map(item =>
					typeof item === 'object' && item !== null
						? this.transformFromApi(item)
						: item
				);
			}
		}

		return result;
	}

	// ========================================================================
	// EXISTING FORMATTING METHODS
	// ========================================================================

	/**
	 * Parse ISO string to Date object
	 */
	private static parseDate(dateString: string | Date): Date {
		if (dateString instanceof Date) {
			return dateString;
		}
		return new Date(dateString);
	}

	/**
	 * Format date only (no time)
	 * @param format - 'short' (10/02/25), 'long' (October 2, 2025)
	 */
	static formatDate(
		dateString: string | Date,
		format: 'short' | 'long' = 'short'
	): string {
		const date = this.parseDate(dateString);

		if (format === 'long') {
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		}

		// Short format: MM/DD/YY
		return date.toLocaleDateString('en-US', {
			year: '2-digit',
			month: '2-digit',
			day: '2-digit'
		});
	}

	/**
	 * Format date + time
	 * @param format - 'short' (10/02/25, 12:37 PM), 'long' (October 2, 2025 at 12:37:32 PM)
	 */
	static formatDateTime(
		dateString: string | Date,
		format: 'short' | 'long' = 'short'
	): string {
		const date = this.parseDate(dateString);

		if (format === 'long') {
			return date.toLocaleString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				second: '2-digit',
				hour12: true
			});
		}

		// Short format: MM/DD/YY, HH:MM AM/PM
		const datePart = date.toLocaleDateString('en-US', {
			year: '2-digit',
			month: '2-digit',
			day: '2-digit'
		});

		const timePart = date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});

		return `${datePart}, ${timePart}`;
	}

	/**
	 * Format time only
	 */
	static formatTime(
		dateString: string | Date,
		format: 'short' | 'long' = 'short'
	): string {
		const date = this.parseDate(dateString);

		if (format === 'long') {
			return date.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				second: '2-digit',
				hour12: true
			});
		}

		// Short: HH:MM AM/PM
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}

	/**
	 * Format duration from minutes to human-readable format
	 * @param minutes - Duration in minutes
	 * @param format - 'short' (1h30min) or 'long' (1 hour 30 minutes)
	 */
	static formatDuration(
		minutes: number,
		format: 'short' | 'long' = 'short'
	): string {
		if (!minutes || minutes === 0) {
			return format === 'long' ? '0 minutes' : '0min';
		}

		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;

		if (format === 'long') {
			if (hours > 0) {
				const hourText = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
				const minText = mins > 0 ? ` ${mins} ${mins === 1 ? 'minute' : 'minutes'}` : '';
				return hourText + minText;
			}
			return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
		}

		// Short format (default)
		if (hours > 0) {
			return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
		}
		return `${mins}min`;
	}

	/**
	 * Format duration from seconds to human-readable format
	 * @param seconds - Duration in seconds
	 * @param format - 'short' (1h30min) or 'long' (1 hour 30 minutes)
	 */
	static formatDurationFromSeconds(
		seconds: number,
		format: 'short' | 'long' = 'short'
	): string {
		const minutes = Math.floor(seconds / 60);
		return this.formatDuration(minutes, format);
	}

	/**
	 * Format as relative time (e.g., "2 hours ago", "3 days ago")
	 */
	static formatRelative(dateString: string | Date): string {
		const date = this.parseDate(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffSeconds = Math.floor(diffMs / 1000);
		const diffMinutes = Math.floor(diffSeconds / 60);
		const diffHours = Math.floor(diffMinutes / 60);
		const diffDays = Math.floor(diffHours / 24);
		const diffWeeks = Math.floor(diffDays / 7);
		const diffMonths = Math.floor(diffDays / 30);
		const diffYears = Math.floor(diffDays / 365);

		if (diffSeconds < 60) {
			return 'just now';
		} else if (diffMinutes < 60) {
			return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
		} else if (diffHours < 24) {
			return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
		} else if (diffDays < 7) {
			return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
		} else if (diffWeeks < 4) {
			return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
		} else if (diffMonths < 12) {
			return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
		} else {
			return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
		}
	}

	/**
	 * Main formatting function - auto-detects type
	 */
	static format(
		dateString: string | Date,
		options: {
			type?: 'date' | 'datetime' | 'time';
			format?: 'short' | 'long' | 'relative';
		} = {}
	): string {
		const { type = 'date', format = 'short' } = options;

		if (format === 'relative') {
			return this.formatRelative(dateString);
		}

		switch (type) {
			case 'datetime':
				return this.formatDateTime(dateString, format);
			case 'time':
				return this.formatTime(dateString, format);
			case 'date':
			default:
				return this.formatDate(dateString, format);
		}
	}
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

// Display formatting
export const formatDate = (date: string | Date, format?: 'short' | 'long') =>
	DateFormatter.formatDate(date, format);

export const formatDateTime = (date: string | Date, format?: 'short' | 'long') =>
	DateFormatter.formatDateTime(date, format);

export const formatTime = (date: string | Date, format?: 'short' | 'long') =>
	DateFormatter.formatTime(date, format);

export const formatDuration = (minutes: number, format?: 'short' | 'long') =>
	DateFormatter.formatDuration(minutes, format);

export const formatDurationFromSeconds = (seconds: number, format?: 'short' | 'long') =>
	DateFormatter.formatDurationFromSeconds(seconds, format);

export const formatRelative = (date: string | Date) =>
	DateFormatter.formatRelative(date);

// API transformation
export const toISOInstant = (value: unknown) =>
	DateFormatter.toISOInstant(value);

export const toDateInputValue = (value: unknown) =>
	DateFormatter.toDateInputValue(value);

export const toDateTimeInputValue = (value: unknown) =>
	DateFormatter.toDateTimeInputValue(value);

export const transformDatesForApi = <T extends Record<string, any>>(data: T, dateFields?: string[]) =>
	DateFormatter.transformForApi(data, dateFields);

export const transformDatesFromApi = <T extends Record<string, any>>(data: T) =>
	DateFormatter.transformFromApi(data);

export default DateFormatter;