<script lang="ts">

	import { Eye } from '@lucide/svelte';
	import DynamicIcon from '$lib/components/UI/DynamicIcon.svelte';

	interface TagItem {
		hasIcon: boolean | undefined;
		icon?: string;
		value: string;
	}

	export let data: TagItem[] = [];

</script>

<section>
	{#each data as tag}
		{#if !tag.hasIcon}
		<span	class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
		<div class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
		{tag.value}
		</span>
			{:else}
		<span	class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
			<DynamicIcon iconName={tag.icon} size={10}/>
			<Eye class="w-3 h-3 mr-1" />
			{tag.value}
		</span>
			{/if}
	{/each}

</section>