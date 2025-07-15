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
				showCopy: true,
				showActivate: true,
				showDeactivate: true,
			};
		case 'category':
			return {
				showView: true,
				showDetails: true,
				showDelete: true,
				showCopy: false,
				showActivate: false,
				showDeactivate: false,
			};
		case 'course':
			return {
				showView: true,
				showDetails: false, // Orders might not have detailed view
				showDelete: false,  // Orders shouldn't be deleted
				showCopy: true,
				showActivate: false,
				showDeactivate: false,
			};
		case 'invoice':
			return {
				showView: true,
				showDetails: true,
				showDelete: false,  // Invoices are immutable
				showCopy: true,
				showActivate: false,
				showDeactivate: false,
			};
		case 'lesson':
			return {
				showView: false,    // Categories might not need view
				showDetails: true,
				showDelete: true,   // Categories can be deleted if empty
				showCopy: false,
				showActivate: false,
				showDeactivate: false,
			};
		default:
			return {
				showView: true,
				showDetails: true,
				showDelete: true,
				showCopy: false,
				showActivate: false,
				showDeactivate: false,
			};
	}
}