<script lang="ts">

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index"
	import { Button } from '$lib/components/ui/button';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis'
	import CopyIcon from '@lucide/svelte/icons/copy'
	import EyeIcon from '@lucide/svelte/icons/eye'
	import InfoIcon from '@lucide/svelte/icons/info'
	import Trash_2 from '@lucide/svelte/icons/trash-2'
	import { DropdownMenuContent } from '$lib/components/ui/dropdown-menu/index.js';
	import { dialogStore } from '$lib/stores/dialog-store';
	import { createEventDispatcher } from 'svelte';
	import { deleteCourse } from '$lib/api/course-api';

	let { id }: { id: string } = $props();

	const dispatch = createEventDispatcher<{
		deleted: { id: string };
	}>();

	// Function to handle delete API call
	async function handleDelete(): Promise<void> {
		dialogStore.setLoading(true);
		console.log("Deleting record with ID " + id);
		try {
			await deleteCourse(id);

			// Dispatch event to parent component to refresh data
			dispatch('deleted', { id });

			// Close dialog and show success
			dialogStore.close();
			dialogStore.success('Course Deleted', 'The course has been successfully deleted.');

		} catch (error) {
			console.error('Error deleting course:', error);
			dialogStore.close();
			dialogStore.error('Delete Failed', 'Failed to delete the course. Please try again.');
		}
	}

	function confirmDelete(): void {
		console.log("Display Dialog")
		dialogStore.confirmDelete({
			title: 'Delete Course',
			description: 'This action cannot be undone. This will permanently delete the course and all associated data.',
			confirmText: 'Delete Course',
			loadingText: 'Deleting...',
			onConfirm: handleDelete
		});
	}

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
		<DropdownMenu.Item
			onclick={confirmDelete}
			class="flex items-center gap-2 text-red-600 focus:text-red-600"
		>
			<Trash_2 size={16} />
			Delete
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
