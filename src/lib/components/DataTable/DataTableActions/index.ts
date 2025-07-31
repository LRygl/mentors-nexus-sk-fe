// index.ts
export { default as ActionButtons } from './data-table-actions.svelte';
export { getEntityVisibilityConfig } from './entityConfig.js';
export type { ActionButtonProps, EntityVisibilityConfig } from './types.js';
// Re-export the shared EntityType for convenience
export type { EntityType } from '$lib/types';