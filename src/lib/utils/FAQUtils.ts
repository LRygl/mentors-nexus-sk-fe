
// Utility functions for API integration
export class FAQUtils {

	static generateSlug(text: string): string {
		return text
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '') // Remove special characters
			.replace(/\s+/g, '-') // Replace spaces with hyphens
			.replace(/-+/g, '-') // Replace multiple hyphens with single
			.replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
	}

	static truncateText(text: string, maxLength: number): string {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength).trim() + '...';
	}

	static formatViewCount(count: number): string {
		if (count < 1000) return count.toString();
		if (count < 1000000) return (count / 1000).toFixed(1) + 'K';
		return (count / 1000000).toFixed(1) + 'M';
	}

	static getHelpfulnessPercentage(helpful: number, notHelpful: number): number {
		const total = helpful + notHelpful;
		if (total === 0) return 0;
		return Math.round((helpful / total) * 100);
	}

	static formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	static formatDateTime(dateString: string): string {
		return new Date(dateString).toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
}