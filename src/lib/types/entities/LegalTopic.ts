import type { BaseEntity } from '$lib/types';
import type { LegalSection } from '$lib/types/entities/LegalSection';

export interface LegalTopic extends BaseEntity {
	name: string;
	subtitle: string;
	effectiveAt: Date;
	showCta: boolean;
	footer: string;
	published: boolean;
	publishedAt: Date;
	publishedBy: string;
	sections: LegalSection[]

}
