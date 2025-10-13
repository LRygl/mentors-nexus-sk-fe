// ============================================================================
// DATE FORMATTING UTILITIES
// Handles ISO date strings from Spring Boot backend
// ============================================================================

/**
 * Format ISO date string: "2025-10-02T12:37:32.327734"
 */
export class DateFormatter {
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

/**
 * Convenience functions
 */
export const formatDate = (date: string | Date, format?: 'short' | 'long') =>
	DateFormatter.formatDate(date, format);

export const formatDateTime = (date: string | Date, format?: 'short' | 'long') =>
	DateFormatter.formatDateTime(date, format);

export const formatTime = (date: string | Date, format?: 'short' | 'long') =>
	DateFormatter.formatTime(date, format);

export const formatRelative = (date: string | Date) =>
	DateFormatter.formatRelative(date);

/**
 * Usage in your UniversalDataTable component:
 *
 * import { DateFormatter } from '$lib/utils/dateFormatter';
 *
 * // In your cell rendering logic:
 * if (column.renderType === 'date') {
 *   const formatted = DateFormatter.format(cellValue, {
 *     type: column.renderOptions?.dateFormat || 'date',
 *     format: column.renderOptions?.format || 'short'
 *   });
 * }
 */

export default DateFormatter;