// types.ts - Data Table Action Component-specific types
import type { EntityType } from '$lib/types';

export interface ActionButtonProps {
	id: string;
	entityType: EntityType;
	deleteFunction: (id: string) => Promise<void>;
	onDeleted?: (id: string) => void;
	onView?: (id: string) => void;
	onDetails?: (id: string) => void;
	// Optional: Override default behavior
	showView?: boolean;
	showDetails?: boolean;
	showDelete?: boolean;
	showCopy?: boolean;
}

export interface EntityVisibilityConfig {
	showView: boolean;
	showDetails: boolean;
	showDelete: boolean;
	showCopy: boolean;
}