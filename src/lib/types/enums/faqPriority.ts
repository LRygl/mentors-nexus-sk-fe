export enum FAQPriority {
	LOW = 'LOW',
	NORMAL = 'NORMAL',
	HIGH = 'HIGH',
	URGENT = 'URGENT'
}

// Helper functions for FAQ priority
export const FAQ_PRIORITY_LABELS: Record<FAQPriority, string> = {
	[FAQPriority.LOW]: 'Low',
	[FAQPriority.NORMAL]: 'Normal',
	[FAQPriority.HIGH]: 'High',
	[FAQPriority.URGENT]: 'Urgent'
};

export const FAQ_PRIORITY_WEIGHTS: Record<FAQPriority, number> = {
	[FAQPriority.LOW]: 1,
	[FAQPriority.NORMAL]: 2,
	[FAQPriority.HIGH]: 3,
	[FAQPriority.URGENT]: 4
};

export const FAQ_PRIORITY_STYLE: Record<FAQPriority, string> = {
	[FAQPriority.LOW]: 'text-green-600 bg-green-50 border-green-200',
	[FAQPriority.NORMAL]: 'text-blue-600 bg-blue-50 border-blue-200',
	[FAQPriority.HIGH]: 'text-orange-600 bg-orange-50 border-orange-200',
	[FAQPriority.URGENT]: 'text-red-600 bg-red-50 border-red-200'
};

export function getFAQPriorityLabel(priority: FAQPriority): string {
	return FAQ_PRIORITY_LABELS[priority] || priority;
}

export function getFAQPriorityWeight(priority: FAQPriority): number {
	return FAQ_PRIORITY_WEIGHTS[priority] || 0;
}

export function getFQAPriorityStyle(priority: FAQPriority): string {
	return FAQ_PRIORITY_STYLE[priority] || 'text-slate-600 bg-slate-50 border-slate-200';
}

// Sort priorities by weight (urgent first)
export function sortByPriority(faqs: Array<{ priority: FAQPriority }>): Array<{ priority: FAQPriority }> {
	return faqs.sort((a, b) => getFAQPriorityWeight(b.priority) - getFAQPriorityWeight(a.priority));
}