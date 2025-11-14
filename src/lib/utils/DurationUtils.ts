
/**
 * Format minutes into human-readable duration
 * Examples: 45 -> "45m", 90 -> "1h 30m", 120 -> "2h"
 */
export function formatDuration(minutes?: number | null): string {
	if (!minutes || minutes === 0) {
		return 'Not set';
	}

	if (minutes < 60) {
		return `${minutes}m`;
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (remainingMinutes === 0) {
		return `${hours}h`;
	}

	return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format minutes into detailed format
 * Example: 90 -> "1 hour 30 minutes"
 */
export function formatDurationDetailed(minutes?: number | null): string {
	if (!minutes || minutes === 0) {
		return 'Duration not set';
	}

	if (minutes < 60) {
		return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	const hourText = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;

	if (remainingMinutes === 0) {
		return hourText;
	}

	const minuteText = `${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
	return `${hourText} ${minuteText}`;
}

/**
 * Convert minutes to hours and minutes object
 */
export function minutesToHoursAndMinutes(minutes: number): { hours: number; minutes: number } {
	return {
		hours: Math.floor(minutes / 60),
		minutes: minutes % 60
	};
}

/**
 * Convert hours and minutes to total minutes
 */
export function hoursAndMinutesToMinutes(hours: number, minutes: number): number {
	return (hours * 60) + minutes;
}

/**
 * Validate duration minutes
 */
export function validateDuration(minutes?: number): string | null {
	if (minutes === undefined || minutes === null) {
		return null; // Optional field
	}

	if (minutes < 0) {
		return 'Duration cannot be negative';
	}

	if (minutes > 24 * 60) {
		return 'Duration cannot exceed 24 hours';
	}

	return null;
}