<script lang="ts">
	import type Product from '../../routes/(public)/store/+page.svelte';
	import AntDesignRiseOutlined from '~icons/ant-design/rise-outlined';
	import AntDesignReloadTimeOutline from '~icons/ant-design/reload-time-outline';
	import CovidQuarantinePlaceTimeCalendarDay from '~icons/covid/quarantine-place-time-calendar-day';

	export let product: Product;
</script>

<div class="flex flex-row justify-between bg-white rounded-lg shadow p-4 cursor-pointer mb-3.5">
	<div class="flex flex-row w-5/6 border-r-1 mr-5">

		<img src={product.image} alt={product.name} class="w-50 h-30 object-cover rounded-md mb-3">
		<div class="flex flex-col ml-3">
			<h2 class="text-2xl font-bold">{product.name}</h2>
			<p>{product.author}</p>
			<p class="text-green-600 font-bold mt-1">${product.price}</p>
		</div>
	</div>
	<div class="flex flex-col w-1/6 justify-between">
		<div class="flex flex-row content-start mt-5">
			<AntDesignRiseOutlined/>
			<p class="ml-5 text-sm text-left">Beginner</p>
		</div>
		<div class="flex flex-row ">
			<AntDesignReloadTimeOutline/>
			<p class="ml-5 text-sm text-left">1h 34m 55s</p>
		</div>
		<div class="flex flex-row  mb-5">
			<CovidQuarantinePlaceTimeCalendarDay/>
			<p class="ml-5 text-sm text-left">Level</p>
		</div>
	</div>

</div>
