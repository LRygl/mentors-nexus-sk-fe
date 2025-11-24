import type { BaseEntity } from '$lib/types';

export interface LegalItem extends BaseEntity {
	content: string;
	orderIndex: number;
}