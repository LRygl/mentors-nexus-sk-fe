import type { BaseEntity } from '$lib/types/common';

export interface User extends BaseEntity {
	id: string;
	uuid: string;
	email: string;
	firstName: string;
	lastName: string;
	role?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}
