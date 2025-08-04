export enum FAQStatus {
	DRAFT = 'DRAFT',
	PUBLISHED = 'PUBLISHED',
	ARCHIVED = 'ARCHIVED',
}

export const FAQ_STATUS_LABELS: Record<FAQStatus, string> = {
	[FAQStatus.DRAFT]: 'Draft',
	[FAQStatus.PUBLISHED]: 'Published',
	[FAQStatus.ARCHIVED]: 'Archived',
}

export const FAQ_STATUS_COLORS: Record<FAQStatus, string> = {
	[FAQStatus.DRAFT]: '#f57c00',
	[FAQStatus.PUBLISHED]: '#2e7d32',
	[FAQStatus.ARCHIVED]: '#c2185b'
}

export function getFAQStatusLabel(status: FAQStatus): string {
	return FAQ_STATUS_LABELS[status] || status;
}

export function getFAQStatusColor(status: FAQStatus): string {
	return FAQ_STATUS_COLORS[status] || '#666';
}