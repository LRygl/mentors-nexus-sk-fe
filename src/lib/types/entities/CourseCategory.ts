import type { BaseEntity } from '$lib/types/common';

export interface CourseCategory extends BaseEntity {
	id: string;
	uuid: string;
	name: string;
	description?: string;
	slug: string;
	displayOrder?: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}
