<script lang="ts">
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { WithElementRef } from "$lib/utils.js";
	import SearchIcon from "@lucide/svelte/icons/search";
	import type { HTMLFormAttributes } from "svelte/elements";
	let { ref = $bindable(null), ...restProps }: WithElementRef<HTMLFormAttributes> = $props();
</script>
<form bind:this={ref} {...restProps}>
	<Sidebar.Group class="py-0">
		<Sidebar.GroupContent class="relative">
			<Label for="search" class="sr-only">Search</Label>
			<Sidebar.Input id="search" placeholder="Search the docs..." class="pl-8" />
			<SearchIcon
				class="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50"
			/>
		</Sidebar.GroupContent>
	</Sidebar.Group>
</form>