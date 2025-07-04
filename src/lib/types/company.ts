import type { User } from '$lib/types/user';

export interface Company {
	id: number;
	uuid: string; // UUID as string
	name: string;
	users: User; // Assuming User is another interface
	vatNumber: string; // DIČ
	registrationNumber: string; // IČO
	createdDate: string; // ISO 8601 string format (Instant)
	updatedDate: string; // ISO 8601 string format (Instant)
	forceVatNumFromRegister: boolean;
	billingInfo: string;
	billingAddress: string;
	currentPlan: string;
	invoice: string;
	companyMembers: User[]; // Set<User> in Java -> array in TypeScript
}

export interface CompanyStoreState {
	data: Company[],
	loading: boolean,
	error: null,
	loaded: boolean,
}

export type CompanyListResponse = Company[];