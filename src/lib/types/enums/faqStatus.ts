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

export const FAQ_STATUS_STYLE: Record<FAQStatus, string> = {
	[FAQStatus.DRAFT]: 'text-amber-600 bg-amber-50 border-amber-200',
	[FAQStatus.PUBLISHED]: 'text-emerald-600 bg-emerald-50 border-emerald-200',
	[FAQStatus.ARCHIVED]: 'text-slate-600 bg-slate-50 border-slate-200'
}

export const FAQ_STATUS_ICON: Record<FAQStatus, string> = {
	[FAQStatus.DRAFT]: 'Clock',
	[FAQStatus.PUBLISHED]: '',
	[FAQStatus.ARCHIVED]: ''
};


export function getFAQStatusLabel(status: FAQStatus): string {
	return FAQ_STATUS_LABELS[status] || status;
}

export function getFAQStatusStyle(status: FAQStatus): string {
	return FAQ_STATUS_STYLE[status] || 'text-slate-600 bg-slate-50 border-slate-200';
}

export function getFAQStatusIcon(status: FAQStatus): string {
	return FAQ_STATUS_ICON[status] || status;
}