<script lang="ts">
	import { ShoppingCart } from 'lucide-svelte';
	import { cartStore } from '$lib/stores/Cart.svelte';
	import { cartService } from '$lib/Services/CartService.svelte';
	import { fly } from 'svelte/transition';

	let itemCount = $derived(cartStore.itemCount);
</script>

<!--
  CartIcon – shows a shopping-cart icon with a badge.
  Clicking it navigates to the checkout page (via CartService).
-->
<button
	onclick={() => cartService.goToCheckout()}
	class="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200"
	aria-label="Shopping cart ({itemCount} items)"
>
	<ShoppingCart class="w-5 h-5 text-gray-700 dark:text-gray-300" />

	{#if itemCount > 0}
		<span
			class="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
			transition:fly={{ y: -4, duration: 200 }}
		>
			{itemCount > 99 ? '99+' : itemCount}
		</span>
	{/if}
</button>
