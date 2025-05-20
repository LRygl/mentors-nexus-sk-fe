<script lang="ts">
	import type Product from '../../routes/(public)/store/+page.svelte';
	export let product: Product;
</script>

<div class="bg-white rounded-lg shadow p-4">
	<img src={product.image} alt={product.name} class="w-full h-40 object-cover rounded-md mb-3">
	<h4 class="font-semibold text-lg">{product.name}</h4>
	<p class="text-green-600 font-bold mt-1">${product.price}</p>
</div>
