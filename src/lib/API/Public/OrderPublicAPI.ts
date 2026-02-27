/**
 * Public (authenticated-user) API for order operations.
 *
 * Maps to Spring Boot OrderController at /api/v1/order.
 */

import { BaseApiService } from '$lib/API/APIBase';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { CheckoutRequest, CheckoutResponse, Order } from '$lib/types/entities/Order';

export class OrderPublicAPI extends BaseApiService {
	private readonly ENDPOINT = API_CONFIG.ENDPOINTS.ORDER;

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	/** Submit a checkout (creates order + invoice + enrollments). */
	async checkout(request: CheckoutRequest): Promise<CheckoutResponse> {
		return this.post<CheckoutResponse>(`${this.ENDPOINT}/checkout`, request);
	}

	/** List all orders for the current user (newest first). */
	async getMyOrders(): Promise<Order[]> {
		return this.get<Order[]>(`${this.ENDPOINT}/my-orders`);
	}

	/** Paginated order list for the current user. */
	async getMyOrdersPaged(page: number = 0, size: number = 20): Promise<any> {
		return this.get(`${this.ENDPOINT}/my-orders/page?page=${page}&size=${size}`);
	}

	/** Get a single order by its ID. */
	async getOrder(orderId: string): Promise<Order> {
		return this.get<Order>(`${this.ENDPOINT}/${orderId}`);
	}
}

export const orderPublicAPI = new OrderPublicAPI();
