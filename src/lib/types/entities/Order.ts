/**
 * Order and checkout related types.
 */

export interface OrderItem {
	id: string;
	courseId: string;
	courseName: string;
	originalPrice: number;
	pricePaid: number;
}

export interface Order {
	id: string;
	uuid: string;
	status: OrderStatus;
	totalAmount: number;
	selectedPaymentMethod: string | null;
	createdAt: string;
	completedAt: string | null;
	invoiceId: string | null;
	invoiceNumber: string | null;
	items: OrderItem[];
}

export enum OrderStatus {
	PENDING = 'PENDING',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
	BANK_TRANSFER = 'BANK_TRANSFER',
	CARD = 'CARD',
	CASH = 'CASH'
}

export interface CheckoutRequest {
	courseIds: number[];
	firstName: string;
	lastName: string;
	email: string;
	telephoneNumber?: string;
	password?: string; // only for new account registration
	street: string;
	city: string;
	postalCode: string;
	country: string;
	selectedPaymentMethod: PaymentMethod;
	termsAccepted: boolean;
	privacyAccepted: boolean;
	marketingConsent?: boolean;
}

export interface CheckoutResponse {
	orderId: string;
	invoiceId: string;
	invoiceNumber: string;
	totalAmount: number;
	status: string;
	enrolledCourses: {
		courseId: string;
		courseName: string;
		courseImageUrl: string | null;
		enrolledAt: string;
		progress: number;
	}[];
}
