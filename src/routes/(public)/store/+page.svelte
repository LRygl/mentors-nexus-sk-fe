<script lang="ts">
	import FilterSidebar from '$lib/components/FilterSidebar.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import ProductList from '$lib/components/ProductList.svelte';

	let displayGrid = true;

	function switchView() {
		displayGrid = !displayGrid;
		console.log(displayGrid)
	}

	export interface Product {
		id: number;
		name: string;
		author: string;
		price: number;
		image: string;
	}

	let products: Product[] = [
		{ id: 1, name: 'Product One', author: 'Paul Duke', price: 29.99, image: 'https://via.assets.so/game.png?id=1&q=95&w=360&h=360&fit=fill' },
		{ id: 2, name: 'Product Two', author: 'Paul Duke', price: 49.99, image: 'https://via.assets.so/game.png?id=2&q=95&w=360&h=360&fit=fill' },
		{ id: 3, name: 'Product Three', author: 'Paul Duke', price: 19.99, image: 'https://via.assets.so/game.png?id=3&q=95&w=360&h=360&fit=fill' },
		{ id: 4, name: 'Product Four', author: 'Paul Duke', price: 19.99, image: 'https://via.assets.so/game.png?id=4&q=95&w=360&h=360&fit=fill' }

	];
</script>

<div class="mx-80">
	<div class="my-25">
		<p class="text-4xl font-bold text-center spacing mb-5">Thousands of courses authored by <br> our network of industry experts</p>
	</div>
	<div>
		<input type="search" placeholder="Search" class="border-1 rounded-2xl h-15 w-full mb-10 px-6" />
	</div>
	<div class="flex flex-row justify-between">
		<div>Reults 4</div>
		<div class="flex flex row justify-around">
			<div class="pr-2">
				<select>
					a
				</select>
			</div>
			<button onclick={switchView}>Display </button>

		</div>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-[250px_1fr] min-h-screen">
		<FilterSidebar />
		{#if displayGrid}
			<ProductGrid {products} />
		{:else}
			<ProductList {products} />
		{/if}
	</div>
</div>



