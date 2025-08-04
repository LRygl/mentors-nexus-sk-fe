<script lang="ts">


	import { BarChart3, Calendar, Icon } from 'lucide-svelte';

	const {
		description,
		mainIcon,
		chartIcon,
		type,
		loading = false
	}:{
		description:string,
		mainIcon: Icon;
		chartIcon: Icon;
		type: 'trend-up' | 'trend-down' | 'trend-nochange',
		loading: boolean;
	} = $props()


</script>


<!-- Today's Activity Card -->
	<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
		{#if loading}
			<div class="animate-pulse">
				<div class="h-4 bg-slate-200 rounded w-20 mb-2"></div>
				<div class="h-8 bg-slate-200 rounded w-16 mb-2"></div>
				<div class="h-3 bg-slate-200 rounded w-24"></div>
			</div>
		{:else}
			<div class="flex items-center justify-between">
				<div>
					<p class="text-slate-600 text-sm">Today's Views</p>
					<p class="text-3xl font-bold text-slate-900">350</p>
					<p class="text-orange-600 text-xs flex items-center gap-1 mt-1">
						<BarChart3 class="w-3 h-3" /> Lorem Ipsum
					</p>
				</div>
				<div class="p-3 bg-orange-100 rounded-xl">
					<Calendar class="w-6 h-6 text-orange-600" />
				</div>
			</div>
		{/if}
	</div>