/**
 * Cart item stored in localStorage.
 * Contains a snapshot of course data at the time of adding to cart.
 */
export interface CartItem {
	id: string; // unique cart item ID (UUID)
	courseId: string; // course ID (string because of normalizeIds)
	courseName: string;
	courseImageUrl: string | null;
	price: number;
	addedAt: string; // ISO timestamp
}
