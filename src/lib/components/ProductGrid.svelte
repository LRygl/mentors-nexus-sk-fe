<script lang="ts">
	import type Product from '../../routes/(public)/store/+page.svelte';
	import ProductCard from './ProductCard.svelte';

	export let products: Product[];
</script>

<main class="p-6">
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each products as product (product.id)}
			<ProductCard {product} />
		{/each}
	</div>
</main>
