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

export const FAQ_PRIORITY_COLORS: Record<FAQPriority, string> = {
	[FAQPriority.LOW]: '#28a745',
	[FAQPriority.NORMAL]: '#6c757d',
	[FAQPriority.HIGH]: '#fd7e14',
	[FAQPriority.URGENT]: '#dc3545'
};

export function getFAQPriorityLabel(priority: FAQPriority): string {
	return FAQ_PRIORITY_LABELS[priority] || priority;
}

export function getFAQPriorityWeight(priority: FAQPriority): number {
	return FAQ_PRIORITY_WEIGHTS[priority] || 0;
}

export function getFAQPriorityColor(priority: FAQPriority): string {
	return FAQ_PRIORITY_COLORS[priority] || '#666';
}

// Sort priorities by weight (urgent first)
export function sortByPriority(faqs: Array<{ priority: FAQPriority }>): Array<{ priority: FAQPriority }> {
	return faqs.sort((a, b) => getFAQPriorityWeight(b.priority) - getFAQPriorityWeight(a.priority));
}