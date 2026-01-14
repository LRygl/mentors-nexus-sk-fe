import type { BaseEntity } from '$lib/types';
import type { LegalItem } from '$lib/types/entities/LegalItem';

export interface LegalSection extends BaseEntity {
	name: string;
	icon: string;
	orderIndex: number;
	items: LegalItem[];
	published?: Date; // Optional published timestamp
}