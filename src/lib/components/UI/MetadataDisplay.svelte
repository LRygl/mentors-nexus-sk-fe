<script lang="ts">
	import DynamicIcon from '$lib/components/UI/DynamicIcon.svelte';

	type MetadataItem = {
		icon?: string;
		description: string;
		value: string;
	};

	export let metadata: MetadataItem[] = [];
	export let variant: 'row' | 'column' = 'row';

</script>

<section>
	<div
		class="flex"
		class:gap-4={variant === 'row'}
		class:flex-col={variant === 'column'}
		class:flex-row={variant === 'row'}
	>
		{#each metadata as item}
			{#if variant === 'row'}
				<div class="flex items-center gap-4 mt-3 text-sm text-slate-500">
					<!-- Icon -->
					<span class="flex items-center gap-1">
						<DynamicIcon iconName={item.icon} size={15} />
						{item.description}: {item.value}
					</span>
				</div>
			{:else}
				<dl class="mb-4">
					<div>
						<div class="flex items-center gap-1">
							<DynamicIcon iconName={item.icon} class="text-slate-500" size={15} />
							<dt class="text-sm font-medium text-slate-500">{item.description}</dt>
						</div>

						<dd class="text-slate-900 text-sm">{item.value}</dd>
					</div>
				</dl>
			{/if}
		{/each}
	</div>
</section>