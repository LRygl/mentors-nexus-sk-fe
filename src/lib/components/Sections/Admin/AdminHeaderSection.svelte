<script lang="ts">

	let {
		heading = '',
		subHeading = ''
	} = $props();

</script>

<div class="mb-6">
	<h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
		{ heading }
	</h1>
	<p class="text-slate-600 mt-2">{ subHeading }</p>
</div>