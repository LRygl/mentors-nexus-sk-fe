<script lang="ts">

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index"
	import { Button } from '$lib/components/ui/button';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis'
	import CopyIcon from '@lucide/svelte/icons/copy'
	import EyeIcon from '@lucide/svelte/icons/eye'
	import InfoIcon from '@lucide/svelte/icons/info'
	import { DropdownMenuContent } from '$lib/components/ui/dropdown-menu/index.js';

	let { id }: { id: string } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon"
				class="relative size-8 p-0"
			>
				<span class="sr-only">Open Menu</span>
				<EllipsisIcon />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)} class="flex items-center gap-2">
				<CopyIcon size={16} />
				Copy to clipboard
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="flex items-center gap-2">
			<EyeIcon size={16} />
			View
		</DropdownMenu.Item>
		<DropdownMenu.Item class="flex items-center gap-2">
			<InfoIcon size={16} />
			Details
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
