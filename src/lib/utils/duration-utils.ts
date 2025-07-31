/**
 * Formats a Java Duration object (or duration string) into a human-readable format
 * @param duration - The duration value (ISO 8601 string, seconds as number, or other format)
 * @returns Formatted duration string (e.g., "1h 30m", "45s", "2m 15s")
 */
export function formatDuration(duration: string | number | null | undefined): string {
	if (!duration) {
		return '-';
	}

	const durationStr = String(duration);

	try {
		// Handle ISO 8601 duration format (PT1H30M45S)
		if (durationStr.startsWith('PT')) {
			const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/;
			const match = durationStr.match(regex);

			if (match) {
				const hours = parseInt(match[1] || '0');
				const minutes = parseInt(match[2] || '0');
				const seconds = parseFloat(match[3] || '0');

				return formatTimeComponents(hours, minutes, seconds);
			}
		}

		// Handle seconds as number
		const totalSeconds = parseFloat(durationStr);
		if (!isNaN(totalSeconds)) {
			const hours = Math.floor(totalSeconds / 3600);
			const minutes = Math.floor((totalSeconds % 3600) / 60);
			const seconds = Math.floor(totalSeconds % 60);

			return formatTimeComponents(hours, minutes, seconds);
		}

		// Handle HH:mm:ss format
		if (durationStr.includes(':')) {
			const parts = durationStr.split(':');
			if (parts.length === 3) {
				const hours = parseInt(parts[0]);
				const minutes = parseInt(parts[1]);
				const seconds = parseFloat(parts[2]);

				if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
					return formatTimeComponents(hours, minutes, seconds);
				}
			}
		}

		// Fallback - return as is
		return durationStr;
	} catch (error) {
		console.error('Error formatting duration:', error);
		return durationStr;
	}
}

/**
 * Helper function to format time components into a readable string
 * @param hours - Hours component
 * @param minutes - Minutes component
 * @param seconds - Seconds component
 * @returns Formatted time string
 */
function formatTimeComponents(hours: number, minutes: number, seconds: number): string {
	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	} else if (minutes > 0) {
		return `${minutes}m ${Math.floor(seconds)}s`;
	} else {
		return `${Math.floor(seconds)}s`;
	}
}

/**
 * Formats duration in a more verbose way (e.g., "1 hour 30 minutes")
 * @param duration - The duration value
 * @returns Verbose formatted duration string
 */
export function formatDurationVerbose(duration: string | number | null | undefined): string {
	if (!duration) {
		return 'No duration';
	}

	const durationStr = String(duration);

	try {
		let hours = 0, minutes = 0, seconds = 0;

		// Handle ISO 8601 duration format (PT1H30M45S)
		if (durationStr.startsWith('PT')) {
			const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/;
			const match = durationStr.match(regex);

			if (match) {
				hours = parseInt(match[1] || '0');
				minutes = parseInt(match[2] || '0');
				seconds = parseFloat(match[3] || '0');
			}
		} else {
			// Handle seconds as number
			const totalSeconds = parseFloat(durationStr);
			if (!isNaN(totalSeconds)) {
				hours = Math.floor(totalSeconds / 3600);
				minutes = Math.floor((totalSeconds % 3600) / 60);
				seconds = Math.floor(totalSeconds % 60);
			}
		}

		const parts: string[] = [];

		if (hours > 0) {
			parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
		}
		if (minutes > 0) {
			parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
		}
		if (seconds > 0 && hours === 0) {
			parts.push(`${Math.floor(seconds)} second${Math.floor(seconds) !== 1 ? 's' : ''}`);
		}

		return parts.length > 0 ? parts.join(' ') : '0 seconds';
	} catch (error) {
		console.error('Error formatting duration verbosely:', error);
		return durationStr;
	}
}

/**
 * Converts duration to total seconds
 * @param duration - The duration value
 * @returns Total seconds as number, or 0 if invalid
 */
export function durationToSeconds(duration: string | number | null | undefined): number {
	if (!duration) {
		return 0;
	}

	const durationStr = String(duration);

	try {
		// Handle ISO 8601 duration format (PT1H30M45S)
		if (durationStr.startsWith('PT')) {
			const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/;
			const match = durationStr.match(regex);

			if (match) {
				const hours = parseInt(match[1] || '0');
				const minutes = parseInt(match[2] || '0');
				const seconds = parseFloat(match[3] || '0');

				return hours * 3600 + minutes * 60 + seconds;
			}
		}

		// Handle seconds as number
		const totalSeconds = parseFloat(durationStr);
		if (!isNaN(totalSeconds)) {
			return totalSeconds;
		}

		return 0;
	} catch (error) {
		console.error('Error converting duration to seconds:', error);
		return 0;
	}
}