// src/lib/components/utils/dateTimeFormat.ts
export function formatDateTime(dateString: Date | string): string {
	const date = new Date(dateString);

	// Check if date is valid
	if (isNaN(date.getTime())) {
		return 'Invalid Date';
	}

	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

export function formatDate(dateString: Date | string): string {
	const date = new Date(dateString);

	if (isNaN(date.getTime())) {
		return 'Invalid Date';
	}

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

export function formatTime(dateString: Date | string): string {
	const date = new Date(dateString);

	if (isNaN(date.getTime())) {
		return 'Invalid Time';
	}

	return date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

export function formatRelativeTime(dateString: Date | string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (isNaN(date.getTime())) {
		return 'Invalid Date';
	}

	// Less than a minute
	if (diffInSeconds < 60) {
		return 'Just now';
	}

	// Less than an hour
	if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60);
		return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
	}

	// Less than a day
	if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours} hour${hours > 1 ? 's' : ''} ago`;
	}

	// Less than a week
	if (diffInSeconds < 604800) {
		const days = Math.floor(diffInSeconds / 86400);
		return `${days} day${days > 1 ? 's' : ''} ago`;
	}

	// Older than a week, show actual date
	return formatDate(date);
}