import DateFormatter from '$lib/utils/DateTimeFormatter';

console.log('Loading APIBase');
import type { RequestConfig } from '$lib/types/common';
import { API_CONFIG } from '$lib/API/APIConfiguration';
import { toastService } from '$lib/Services/ToastService.svelte';
import type { APIErrorResponse } from '$lib/types/entities/APIErrorResponse';

export abstract class BaseApiService {
	protected readonly baseUrl: string;
	private readonly defaultTimeout = 30000;
	private readonly defaultRetries = 3;
	private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

	private readonly API_PATH = API_CONFIG.PATH + '/' + API_CONFIG.VERSION;

	constructor(baseUrl?: string) {
		// Handle empty or undefined baseUrl (production same-origin)
		this.baseUrl = baseUrl || '';
	}

	// Common HTTP methods with error handling and interceptors
	protected async get<T>(
		endpoint: string,
		params?: Record<string, any>,
		config?: RequestConfig
	): Promise<T> {
		const url = this.buildUrl(endpoint, params);
		const cacheKey = `GET:${url}`;

		// Check cache first
		if (config?.cache && this.isCacheValid(cacheKey)) {
			return this.cache.get(cacheKey)!.data;
		}

		// Prepare headers for the request
		const headers = await this.getHeaders(config);

		const response = await this.executeRequest(
			() =>
				fetch(url, {
					method: 'GET',
					headers,
					credentials: 'include',
					signal: this.createAbortSignal(config?.timeout)
				}),
			config
		);

		const data = await this.parseResponse<T>(response);

		// Cache successful GET requests
		if (config?.cache) {
			this.setCacheEntry(cacheKey, data, 5 * 60 * 1000); // 5 minutes TTL
		}

		return data;
	}

	/*
	 * Base HTTP POST method for partial updates
	 */
	protected async post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
		const url = this.buildUrl(endpoint);
		const headers = await this.getHeaders(config);

		// Transform dates before sending
		const transformedBody = body ? DateFormatter.transformForApi(body) : undefined;

		const response = await this.executeRequest(
			() =>
				fetch(url, {
					method: 'POST',
					headers,
					body: transformedBody ? JSON.stringify(transformedBody) : undefined,
					credentials: 'include',
					signal: this.createAbortSignal(config?.timeout)
				}),
			config
		);

		const data = await this.parseResponse<T>(response);

		// Invalidate related cache entries
		this.invalidateCache('GET');
		return data;
	}

	/*
	 * Base HTTP POST method for multipart/form-data (file uploads with JSON)
	 * This method does NOT set Content-Type header - browser sets it automatically with boundary
	 */
	protected async postMultipart<T>(
		endpoint: string,
		formData: FormData,
		config?: RequestConfig
	): Promise<T> {
		const url = this.buildUrl(endpoint);
		const headers = await this.getHeadersForMultipart(config);

		const response = await this.executeRequest(
			() =>
				fetch(url, {
					method: 'POST',
					body: formData, // Send FormData directly
					headers: headers,
					credentials: 'include',
					signal: this.createAbortSignal(config?.timeout)
				}),
			config
		);

		const data = await this.parseResponse<T>(response);

		// Invalidate related cache entries
		this.invalidateCache('GET');
		return data;
	}

	/*
	 * Base HTTP PUT method for partial updates
	 */
	protected async put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
		const url = this.buildUrl(endpoint);
		const headers = await this.getHeaders(config);

		// Transform dates before sending
		const transformedBody = body ? DateFormatter.transformForApi(body) : undefined;

		const response = await this.executeRequest(
			() =>
				fetch(url, {
					method: 'PUT',
					headers,
					body: transformedBody ? JSON.stringify(transformedBody) : undefined,
					credentials: 'include',
					signal: this.createAbortSignal(config?.timeout)
				}),
			config
		);

		const data = await this.parseResponse<T>(response);

		//Invalidate related cache entries
		this.invalidateCache('GET');

		return data;
	}

	/*
	 * Base HTTP PUT method for multipart/form-data (file uploads with JSON)
	 */
	protected async putMultipart<T>(
		endpoint: string,
		formData: FormData,
		config?: RequestConfig
	): Promise<T> {
		const url = this.buildUrl(endpoint);

		// Get all headers except Content-Type
		const headers = await this.getHeadersForMultipart(config);

		const response = await this.executeRequest(
			() =>
				fetch(url, {
					method: 'PUT',
					headers: headers,
					body: formData,
					credentials: 'include',
					signal: this.createAbortSignal(config?.timeout)
				}),
			config
		);

		const data = await this.parseResponse<T>(response);

		//Invalidate related cache entries
		this.invalidateCache('GET');

		return data;
	}

	/*
	 * Base HTTP PATCH method for partial updates
	 */
	protected async patch<T>(
		endpoint: string,
		params?: Record<string, any>,
		config?: RequestConfig
	): Promise<T> {
		const url = this.buildUrl(endpoint, params);
		const cacheKey = `PUT:${url}`;
		// Prepare headers for the request
		const headers = await this.getHeaders(config);

		const response = await this.executeRequest(
			() =>
				fetch(url, {
					method: 'PATCH',
					headers,
					credentials: 'include',
					signal: this.createAbortSignal(config?.timeout)
				}),
			config
		);

		const data = await this.parseResponse<T>(response);

		// Invalidate related Cache entries
		this.invalidateCache('GET');
		return data;
	}

	/*
	 * Base HTTP DELETE method for partial updates
	 */
	protected async delete<T = void>(endpoint: string, config?: RequestConfig): Promise<T> {
		const url = this.buildUrl(endpoint);
		const headers = await this.getHeaders(config);
		const response = await this.executeRequest(
			() =>
				fetch(url, {
					method: 'DELETE',
					headers,
					credentials: 'include',
					signal: this.createAbortSignal(config?.timeout)
				}),
			config
		);

		const data = await this.parseResponse<T>(response);

		// Invalidate related cache entries
		this.invalidateCache('GET');

		return data;
	}

	///////////////////////////////////////////////
	/// UTILITY METHODS
	///////////////////////////////////////////////

	private async getHeaders(config?: RequestConfig): Promise<HeadersInit> {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		};

		// Add correlation ID for distributed tracing
		headers['X-Correlation-ID'] = this.generateCorrelationId();

		return headers;
	}

	/**
	 * Get headers for multipart requests (excludes Content-Type)
	 */
	private async getHeadersForMultipart(config?: RequestConfig): Promise<HeadersInit> {
		const headers = await this.getHeaders(config);

		// Remove Content-Type - browser will set it with boundary
		delete (headers as Record<string, string>)['Content-Type'];

		return headers;
	}

	private buildUrl(endpoint: string, params?: Record<string, any>): string {
		// IMPORTANT: Always start with / to make it root-relative
		let path = `/${this.API_PATH}${endpoint}`;

		// Add query parameters if they exist
		if (params) {
			const queryParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					queryParams.append(key, value.toString());
				}
			});
			const queryString = queryParams.toString();
			if (queryString) {
				path += `?${queryString}`;
			}
		}

		// Production: use root-relative URLs (empty baseUrl)
		// Development: prepend baseUrl
		if (!this.baseUrl || this.baseUrl === '') {
			return path; // '/api/v1/auth/login' - starts with / so it's from root
		}

		// Development with full URL
		return `${this.baseUrl}${path}`;
	}

	private async executeRequest(
		requestFn: () => Promise<Response>,
		config?: RequestConfig
	): Promise<Response> {
		const maxRetries = config?.retries ?? this.defaultRetries;
		let lastError: Error;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			console.log('[API] Retry attempt', attempt);
			try {
				const response = await requestFn();

				// Don't retry on 4xx errors (client errors)
				if (!response.ok && response.status >= 400 && response.status < 500) {
					throw await this.createApiError(response);
				}

				if (response.ok) {
					return response;
				}

				// 5xx errors - retry
				throw new Error(`Server error: ${response.status}`);
			} catch (error) {
				lastError = error as Error;

				// Don't retry on certain errors
				if (this.shouldNotRetry(error)) {
					throw error;
				}

				// Wait before retry with exponential backoff
				if (attempt < maxRetries) {
					await this.wait(Math.pow(2, attempt) * 1000);
				}
			}
		}

		throw lastError!;
	}

	private async parseResponse<T>(response: Response): Promise<T> {
		const contentType = response.headers.get('content-type');

		if (!response.ok) {
			if (contentType?.includes('application/json')) {
				const errorData: APIErrorResponse = await response.json();
				console.log('[API] Error Log Notification trigger test');
				toastService.warning(errorData?.applicationErrorCode, errorData?.applicationErrorMessage);
			}
		}

		if (contentType?.includes('application/json')) {
			const data = await response.json();

			// Handle Spring Boot ResponseEntity pattern
			const payload = data.data !== undefined ? data.data : data;

			// Normalize IDs tto strings
			return this.normalizeIds(payload) as T;
		}

		// Handle TEXT Responses
		if (contentType?.includes('text/')) {
			return (await response.text()) as unknown as T;
		}

		// HAndle empty responses (Like DELETE operation)
		if (response.status === 204) {
			return undefined as unknown as T;
		}

		throw new Error(`Unsupported content type: ${contentType}`);
	}

	/**
	 * Recursively normalize any `id` Fields into strings.
	 */
	private normalizeIds(obj: unknown): unknown {
		if (Array.isArray(obj)) {
			return obj.map((item) => this.normalizeIds(item));
		} else if (obj !== null && typeof obj === 'object') {
			const normalized: Record<string, any> = {};
			for (const [key, value] of Object.entries(obj)) {
				if (key === 'id' && (typeof value === 'number' || typeof value === 'bigint')) {
					normalized[key] = String(value);
				} else {
					normalized[key] = this.normalizeIds(value);
				}
			}
			return normalized;
		}
		return obj;
	}

	private async createApiError(response: Response): Promise<Error> {
		try {
			const errorData = await response.json();

			toastService.warning(
				'Error - ' + errorData?.applicationErrorCode,
				errorData?.applicationErrorMessage
			);

			return new ApiError(
				errorData.message || `HTTP ${response.status}: ${response.statusText}`,
				response.status,
				errorData.code,
				errorData.field
			);
		} catch {
			return new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
		}
	}

	private shouldNotRetry(error: unknown): boolean {
		if (error instanceof ApiError) {
			// Dont retry client errors(4xx)
			return error.status >= 400 && error.status < 500;
		}

		if (error instanceof Error) {
			return error.name === 'AbortError';
		}

		return false;
	}

	private wait(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private createAbortSignal(timeout?: number): AbortSignal {
		const controller = new AbortController();
		const timeoutMs = timeout || this.defaultTimeout;

		setTimeout(() => controller.abort(), timeoutMs);

		return controller.signal;
	}

	private generateCorrelationId(): string {
		return crypto.randomUUID();
	}

	// Cache management
	private isCacheValid(key: string): boolean {
		const entry = this.cache.get(key);
		if (!entry) return false;

		return Date.now() - entry.timestamp < entry.ttl;
	}

	private setCacheEntry(key: string, data: any, ttl: number): void {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
			ttl
		});
	}

	private invalidateCache(pattern?: string): void {
		if (pattern) {
			const keysToDelete: string[] = [];
			for (const key of this.cache.keys()) {
				if (key.includes(pattern)) {
					keysToDelete.push(key);
				}
			}
			keysToDelete.forEach((key) => this.cache.delete(key));
		} else {
			this.cache.clear();
		}
	}

	// Health check endpoint
	async healthCheck(): Promise<{ status: string; timestamp: string }> {
		try {
			return await this.get('/actuator/health', undefined, {
				skipAuth: true,
				timeout: 5000
			});
		} catch {
			return {
				status: 'DOWN',
				timestamp: new Date().toISOString()
			};
		}
	}
}

// Custom API Error class
export class ApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly code?: string,
		public readonly field?: string
	) {
		super(message);
		this.name = 'ApiError';
	}

	get isClientError(): boolean {
		return this.status >= 400 && this.status < 500;
	}

	get isServerError(): boolean {
		return this.status >= 500;
	}
}