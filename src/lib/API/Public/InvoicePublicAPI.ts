/**
 * Public (authenticated-user) API for invoice operations.
 *
 * Maps to Spring Boot InvoiceController user-facing endpoints at /api/v1/invoice.
 */

import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { InvoiceDetail, InvoiceListItem } from '$lib/types/entities/Invoice';

export class InvoicePublicAPI extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.INVOICE;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	/** List all invoices for the current user (newest first). */
	async getMyInvoices(): Promise<InvoiceListItem[]> {
		return this.get<InvoiceListItem[]>(`${this.ENDPOINT}/my-invoices`);
	}

	/** Paginated invoice list for the current user. */
	async getMyInvoicesPaged(page: number = 0, size: number = 20): Promise<any> {
		return this.get(`${this.ENDPOINT}/my-invoices/page?page=${page}&size=${size}`);
	}

	/** Get full invoice detail (with line items + billing). */
	async getInvoiceDetail(invoiceId: string): Promise<InvoiceDetail> {
		return this.get<InvoiceDetail>(`${this.ENDPOINT}/${invoiceId}/detail`);
	}

	/**
	 * Download invoice PDF as a Blob.
	 * The caller should create an object URL and trigger a download.
	 */
	async downloadInvoicePdf(invoiceId: string): Promise<Blob> {
		const response = await fetch(
			`${API_CONFIG.FULL_BASE_URL}${this.ENDPOINT}/${invoiceId}/pdf`,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					Accept: 'application/pdf'
				}
			}
		);

		if (!response.ok) {
			throw new Error(`Failed to download PDF: ${response.statusText}`);
		}

		return response.blob();
	}
}

export const invoicePublicAPI = new InvoicePublicAPI();
