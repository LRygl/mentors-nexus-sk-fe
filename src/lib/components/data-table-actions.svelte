<script lang="ts">

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index"
	import { Button } from '$lib/components/ui/button';
	import { EllipsisIcon, CopyIcon, EyeIcon, InfoIcon, Trash2 } from 'lucide-svelte'
	import { dialogStore } from '$lib/stores/dialog-store';
	import { createEventDispatcher, type Snippet } from 'svelte';
	import { deleteCourse } from '$lib/api/course-api';
	import { t, type AsyncStore, type TranslationKey } from '$lib/stores/internalization-store';

	interface Props {
		languageStore: AsyncStore<any>;
	}

	let { id, languageStore }: { id: string, languageStore: string } = $props();

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
				{$t.action.copyToClipboard}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="flex items-center gap-2">
			<EyeIcon size={16} />
			{$t.action.view}
		</DropdownMenu.Item>
		<DropdownMenu.Item class="flex items-center gap-2">
			<InfoIcon size={16} />
			{$t.action.details}
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={confirmDelete}
			class="flex items-center gap-2 text-red-600 focus:text-red-600">
			<Trash2 size={16} />
			{$t.action.delete}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
