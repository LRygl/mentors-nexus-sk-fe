/**
 * Invoice types for the user-facing invoice pages.
 */

import type { OrderItem } from './Order';

/**
 * Lightweight invoice for list views.
 */
export interface InvoiceListItem {
	id: string;
	invoiceNumber: string;
	totalAmount: number;
	currency: string;
	paid: boolean;
	issuedDate: string;
	dueDate: string;
	paidDate: string | null;
	itemCount: number;
}

/**
 * Full invoice detail with line items and billing info.
 */
export interface InvoiceDetail {
	id: string;
	uuid: string;
	invoiceNumber: string;

	// Billing info
	billingFirstName: string;
	billingLastName: string;
	billingEmail: string;
	billingStreet: string;
	billingCity: string;
	billingPostalCode: string;
	billingCountry: string;

	// Financial
	totalAmount: number;
	currency: string;
	paid: boolean;

	// Dates
	issuedDate: string;
	dueDate: string;
	paidDate: string | null;

	// Line items
	items: OrderItem[];

	// PDF
	invoicePdfLink: string | null;
	invoicePdfName: string | null;
}
