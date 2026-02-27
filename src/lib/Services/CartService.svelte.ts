/**
 * Cart service – high-level operations on top of CartStore.
 *
 * Provides toast notifications, auth-aware actions,
 * and the checkout orchestration flow.
 */

import { cartStore } from '$lib/stores/Cart.svelte';
import { toastService } from '$lib/Services/ToastService.svelte';
import { orderPublicAPI } from '$lib/API/Public/OrderPublicAPI';
import { enrollmentService } from '$lib/Services/EnrollmentService.svelte';
import { goto } from '$app/navigation';
import { ROUTES } from '$lib/Config/routes.config';
import type { CheckoutRequest, CheckoutResponse } from '$lib/types/entities/Order';

class CartService {
	// ── Cart item management ────────────────────────────────────────

	/**
	 * Add a course to the cart with user feedback.
	 * Silently ignores duplicates.
	 *
	 * @param course  Course data to add.
	 * @param options.redirectToCheckout  If true, navigate to checkout after adding.
	 *        Use on course-detail pages where the user clicks "Purchase Now".
	 *        On the store listing page leave false so users can keep browsing.
	 */
	addToCart(
		course: {
			courseId: string;
			courseName: string;
			courseImageUrl: string | null;
			price: number;
		},
		options?: { redirectToCheckout?: boolean }
	): void {
		const added = cartStore.addItem(course);

		if (added) {
			toastService.success('Added to cart', `${course.courseName} has been added to your cart.`);
		} else {
			toastService.info('Already in cart', `${course.courseName} is already in your cart.`);
		}

		if (options?.redirectToCheckout) {
			this.goToCheckout();
		}
	}

	/**
	 * Remove a course from the cart by its courseId.
	 */
	removeFromCart(courseId: string, courseName?: string): void {
		cartStore.removeByCourseId(courseId);
		toastService.info('Removed', `${courseName ?? 'Course'} removed from cart.`);
	}

	/**
	 * Remove a specific cart item by its unique cart item id.
	 */
	removeCartItem(cartItemId: string): void {
		cartStore.removeItem(cartItemId);
	}

	// ── Navigation helpers ──────────────────────────────────────────

	/**
	 * Navigate to the checkout page.
	 * Both authenticated and non-authenticated users go directly to checkout.
	 * The checkout page itself handles inline registration for guests.
	 */
	goToCheckout(): void {
		if (cartStore.isEmpty) {
			toastService.warning('Empty cart', 'Add some courses before proceeding to checkout.');
			return;
		}

		goto(ROUTES.PUBLIC.STORE + '/checkout');
	}

	// ── Checkout ────────────────────────────────────────────────────

	/**
	 * Submit the checkout request to the backend.
	 *
	 * On success:
	 *   1. Clears the cart
	 *   2. Refreshes enrollment data so "My Learning" is up-to-date
	 *   3. Shows a success toast
	 *   4. Returns the response so the calling page can navigate
	 */
	async checkout(request: CheckoutRequest): Promise<CheckoutResponse> {
		try {
			const response = await orderPublicAPI.checkout(request);

			// Clear the cart after successful checkout
			cartStore.clear();

			// Refresh enrolled courses so My Learning updates immediately
			await enrollmentService.refresh();

			toastService.success(
				'Purchase complete!',
				`Order #${response.invoiceNumber} has been created. Your courses are now available.`
			);

			return response;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Checkout failed. Please try again.';
			toastService.error('Checkout failed', message);
			throw error;
		}
	}
}

export const cartService = new CartService();
