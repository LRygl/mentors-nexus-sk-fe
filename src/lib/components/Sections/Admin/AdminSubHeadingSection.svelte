<script lang="ts">

	let {
		heading = '',
		subHeading = ''
	} = $props();

</script>

<div class="mb-6">
	<div class="flex items-center gap-2">
		<div class="h-5 w-1 rounded bg-indigo-500"></div>
		<h2 class="text-lg font-semibold text-slate-800">{heading}</h2>
	</div>
	{#if subHeading}
		<p class="text-sm text-slate-500 mt-1 ml-3">{ subHeading }</p>
	{/if}
</div>