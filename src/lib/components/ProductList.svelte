<script lang="ts">
	import type Product from '../../routes/(public)/store/+page.svelte';
	import ProductListCard from '$lib/components/ProductListCard.svelte';

	export let products: Product[];
</script>

<main class="p-6">
	<div class="gap-6">
		{#each products as product (product.id)}
			<ProductListCard {product} />
		{/each}
	</div>
</main>
