/**
 * Cart store using Svelte 5 runes with localStorage persistence.
 *
 * The cart is stored entirely in localStorage so that anonymous (not-yet-logged-in)
 * users can add courses before registering.  On login the cart stays as-is;
 * on checkout the backend validates everything.
 */

import { browser } from '$app/environment';
import type { CartItem } from '$lib/types/entities/CartItem';

const STORAGE_KEY = 'mentors_cart';

class CartStore {
	// ── Reactive state ──────────────────────────────────────────────
	items = $state<CartItem[]>([]);

	// ── Derived getters ─────────────────────────────────────────────

	/** Total number of items in the cart. */
	get itemCount(): number {
		return this.items.length;
	}

	/** Sum of all item prices. */
	get totalPrice(): number {
		return this.items.reduce((sum, item) => sum + item.price, 0);
	}

	/** True when the cart is empty. */
	get isEmpty(): boolean {
		return this.items.length === 0;
	}

	/** Array of courseId strings currently in the cart. */
	get courseIds(): string[] {
		return this.items.map((item) => item.courseId);
	}

	// ── Lifecycle ───────────────────────────────────────────────────

	/** Load cart from localStorage.  Call once on app mount. */
	initialize(): void {
		if (!browser) return;

		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed: CartItem[] = JSON.parse(raw);
				// Validate basic shape – discard corrupt data
				if (Array.isArray(parsed)) {
					this.items = parsed;
				}
			}
		} catch (err) {
			console.warn('[Cart] Failed to load cart from localStorage', err);
			this.items = [];
		}
	}

	// ── Cart operations ─────────────────────────────────────────────

	/**
	 * Add a course to the cart.
	 * Silently ignores duplicates (same courseId).
	 */
	addItem(course: { courseId: string; courseName: string; courseImageUrl: string | null; price: number }): boolean {
		if (this.isInCart(course.courseId)) {
			return false; // already present
		}

		const item: CartItem = {
			id: crypto.randomUUID(),
			courseId: course.courseId,
			courseName: course.courseName,
			courseImageUrl: course.courseImageUrl,
			price: course.price,
			addedAt: new Date().toISOString()
		};

		this.items = [...this.items, item];
		this.persist();
		return true;
	}

	/** Remove a single item by its cart-item id. */
	removeItem(cartItemId: string): void {
		this.items = this.items.filter((i) => i.id !== cartItemId);
		this.persist();
	}

	/** Remove a course by courseId (string). */
	removeByCourseId(courseId: string): void {
		this.items = this.items.filter((i) => i.courseId !== courseId);
		this.persist();
	}

	/** Check whether a course is already in the cart. */
	isInCart(courseId: string): boolean {
		return this.items.some((i) => i.courseId === courseId);
	}

	/** Empty the whole cart (e.g. after successful checkout). */
	clear(): void {
		this.items = [];
		this.persist();
	}

	// ── Persistence ─────────────────────────────────────────────────

	private persist(): void {
		if (!browser) return;

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
		} catch (err) {
			console.warn('[Cart] Failed to persist cart', err);
		}
	}
}

// Singleton export
export const cartStore = new CartStore();

// Debug helper
if (typeof window !== 'undefined') {
	(window as any).cartStore = cartStore;
}
