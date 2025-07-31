<script lang="ts">
	import { Input } from "$lib/components/ui/input/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Plus, X } from "lucide-svelte";
	import { Badge } from "$lib/components/ui/badge/index.js";

	interface Props {
		label: string;
		placeholder: string;
		items: string[];
		id: string;
	}

	let { label, placeholder, items = $bindable([]), id }: Props = $props();

	let inputValue = $state<string>("");

	function addItem(): void {
		const trimmedValue = inputValue.trim();
		if (trimmedValue && !items.includes(trimmedValue)) {
			items = [...items, trimmedValue];
			inputValue = "";
		}
	}

	function removeItem(itemToRemove: string): void {
		items = items.filter(item => item !== itemToRemove);
	}

	function handleKeyPress(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			addItem();
		}
	}
</script>

<div class="space-y-2">
	<Label for={id}>{label}</Label>
	<div class="flex gap-2">
		<Input
			{id}
			bind:value={inputValue}
			{placeholder}
			onkeypress={handleKeyPress}
		/>
		<Button type="button" variant="outline" onclick={addItem}>
			<Plus class="w-4 h-4" />
		</Button>
	</div>
	{#if items.length > 0}
		<div class="flex flex-wrap gap-2 mt-2">
			{#each items as item}
				<Badge variant="secondary" class="flex items-center gap-1">
					{item}
					<button
						type="button"
						class="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
						onclick={() => removeItem(item)}
					>
						<X class="w-3 h-3" />
					</button>
				</Badge>
			{/each}
		</div>
	{/if}
</div>