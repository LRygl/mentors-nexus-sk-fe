export function formatDateTime(dateString: Date): string {
	const date = new Date(dateString);
	return date.toLocaleString('cs-CZ', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	});
}