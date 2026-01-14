import type { BaseEntity } from '$lib/types';

export interface LegalItem extends BaseEntity {
	content: string;
	orderIndex: number;
	subItems?: LegalItem[];
	published?: Date; // Optional published timestamp
}