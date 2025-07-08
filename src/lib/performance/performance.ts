export const measurePerformanceAsync = async <T>(
	name: string,
	fn: () => Promise<T>
): Promise<T> => {
	const start = performance.now();
	try {
		const result = await fn();
		const end = performance.now();

		// Only log in development
		if (import.meta.env.DEV) {
			console.debug(`${name}: ${end - start}ms`);
		}

		return result;
	} catch (error) {
		const end = performance.now();
		console.error(`${name} failed after ${end - start}ms:`, error);
		throw error;
	}
};

// Performance observer for monitoring
export const performanceObserver = {
	entries: [] as { name: string; duration: number; timestamp: number }[],

	record(name: string, duration: number) {
		this.entries.push({
			name,
			duration,
			timestamp: Date.now()
		});

		// Keep only last 100 entries to prevent memory leaks
		if (this.entries.length > 100) {
			this.entries.shift();
		}
	},

	getAverageTime(name: string): number {
		const filtered = this.entries.filter(entry => entry.name === name);
		if (filtered.length === 0) return 0;

		const total = filtered.reduce((sum, entry) => sum + entry.duration, 0);
		return total / filtered.length;
	},

	getSlowOperations(threshold = 100): typeof this.entries {
		return this.entries.filter(entry => entry.duration > threshold);
	}
};