import type { RequestConfig } from '$lib/types/common';

export abstract class BaseApiService {
	protected readonly baseUrl: string;
	private readonly defaultTimeout = 30000;
	private readonly defaultRetries = 3;
	private cache = new Map<string, { data: any; timestamp: number; ttl: number}>();

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	// Common HTTP methods with error handling and interceptors
	protected async get<T>(
		endpoint: string,
		params?: Record<string, any>,
		config?: RequestConfig
	): Promise<T> {
		const url = this.buildUrl(endpoint, params);
		console.log('Calling URL:' + url);
		const cacheKey = `GET:${url}`;

		// Check cache first
		if (config?.cache && this.isCacheValid(cacheKey)) {
			return this.cache.get(cacheKey)!.data;
		}

		// Prepare headers for the request
		const headers = await this.getHeaders(config);

		const response = await this.executeRequest(() =>
				fetch(url, {
					method: 'GET',
					headers,
					signal: this.createAbortSignal(config?.timeout),
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


	///////////////////////////////////////////////
	/// UTILITY METHODS
	///////////////////////////////////////////////

	private async getHeaders(config?: RequestConfig): Promise<HeadersInit> {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		};

/*
		// Add authentication header if not skipped
		if (!config?.skipAuth) {
			const token = await this.getAuthToken();
			if (token) {
				headers['Authorization'] = `Bearer ${token}`;
			}
		}

		// Add CSRF token if available (similar to Spring Security)
		const csrfToken = this.getCsrfToken();
		if (csrfToken) {
			headers['X-CSRF-Token'] = csrfToken;
		}
	*/

		// Add correlation ID for distributed tracing
		headers['X-Correlation-ID'] = this.generateCorrelationId();

		return headers;

	}

	private buildUrl(endpoint: string, params?: Record<string, any>): string {
		const url = new URL(endpoint, this.baseUrl);

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					url.searchParams.append(key, value.toString());
				}
			});
		}
		return url.toString();
	}

	private async executeRequest(
		requestFn: () => Promise<Response>,
		config?: RequestConfig
	): Promise<Response> {
		const maxRetries = config?.retries ?? this.defaultRetries;
		let lastError: Error;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
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

		if (contentType?.includes('application/json')) {
			const data = await response.json();

			// Handle spring boot responseEntity pattern
			if (data.data !== undefined) {
				return data.data;
			}
			 return data;
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

	private async createApiError(response: Response): Promise<Error> {
		try {
			const errorData = await response.json();
			return new ApiError(
				errorData.message || `HTTP ${response.status}: ${response.statusText}`,
				response.status,
				errorData.code,
				errorData.field
			);
		} catch {
			return new ApiError(
				`HTTP ${response.status}: ${response.statusText}`,
				response.status
			);
		}
	}

	private shouldNotRetry(error: unknown): boolean {
		if (error instanceof ApiError) {
			// Dont retry client errors(4xx)
			return error.status >= 400 && error.status < 500;
		}

		if (error instanceof  Error) {
			return error.name === 'AbortError';
		}

		return false;
	}

	private wait(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private createAbortSignal(timeout?: number): AbortSignal {
		const controller = new AbortController();
		const timeoutMs = timeout || this.defaultTimeout;

		setTimeout(() => controller.abort(), timeoutMs);

		return controller.signal;
	}

	private generateCorrelationId(): string {
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

	protected clearCache(pattern?: string): void {
		if (pattern) {
			for (const key in this.cache.keys()) {
				if (key.includes(pattern)) {
					this.cache.delete(key);
				}
			}
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