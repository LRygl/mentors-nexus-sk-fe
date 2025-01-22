<script>
	import Counter from '$lib/components/counter.svelte'
</script>

<table class="table-auto border-collapse border border-slate-500">
	<thead class="bg-indigo-500 m-5">
	<tr>
		<th scope="col" class="p-2 border border-slate-600">Summary</th>
		<th scope="col" class="p-2 border border-slate-600">Effort</th>
		<th scope="col" class="p-2 border border-slate-600">Impact</th>
		<th scope="col" class="p-2 border border-slate-600">Insights</th>
		<th scope="col" class="p-2 border border-slate-600">Impact Score</th>
		<th scope="col" class="p-2 border border-slate-600">Comments</th>
	</tr>
	</thead>
	<tbody>
		<tr>
			<td>Test</td>
			<td>3</td>
			<td>5</td>
			<td><Counter/></td>
			<td>85</td>
			<td>13</td>
		</tr>
	</tbody>
</table>

<style>

</style>