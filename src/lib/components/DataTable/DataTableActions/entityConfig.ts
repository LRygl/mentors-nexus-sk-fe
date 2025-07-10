// entityConfig.ts - Simple configuration
import type { EntityType } from '$lib/types';
import type { EntityVisibilityConfig } from './types.js';

export function getEntityVisibilityConfig(entityType: EntityType): EntityVisibilityConfig {
	switch (entityType) {
		case 'user':
			return {
				showView: true,
				showDetails: true,
				showDelete: true,
				showCopy: true
			};
		case 'category':
			return {
				showView: true,
				showDetails: true,
				showDelete: true,
				showCopy: false
			};
		case 'course':
			return {
				showView: true,
				showDetails: false, // Orders might not have detailed view
				showDelete: false,  // Orders shouldn't be deleted
				showCopy: true      // Copy order ID for reference
			};
		case 'invoice':
			return {
				showView: true,
				showDetails: true,
				showDelete: false,  // Invoices are immutable
				showCopy: true
			};
		case 'lesson':
			return {
				showView: false,    // Categories might not need view
				showDetails: true,
				showDelete: true,   // Categories can be deleted if empty
				showCopy: false
			};
		default:
			return {
				showView: true,
				showDetails: true,
				showDelete: true,
				showCopy: false
			};
	}
}