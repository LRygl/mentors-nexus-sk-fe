/**
 * Central type exports - keep it simple!
 *
*/


// Common base types
export type {
	BaseEntity,
	PaginationParams,
	PaginatedResult,
	ApiError,
	RequestConfig
} from './common';

export {
	FAQStatus,
	getFAQStatusLabel,
	getFAQStatusColor
} from './enums/faqStatus';

export {
	FAQPriority,
	getFAQPriorityLabel,
	getFAQPriorityColor
} from './enums/faqPriority';

