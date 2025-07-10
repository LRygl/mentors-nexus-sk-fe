<script lang="ts">

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { EllipsisIcon, CopyIcon, EyeIcon, InfoIcon, Trash2 } from 'lucide-svelte';
	import { dialogStore } from '$lib/stores/dialog-store';
	import { createEventDispatcher, type Snippet } from 'svelte';
	import { deleteCourse } from '$lib/api/course-api';
	import { translation  } from '$lib/stores/internalization-store';
	import type { ActionButtonProps } from '$lib/components/DataTable/DataTableActions/types';
	import { getEntityVisibilityConfig } from '$lib/components/DataTable/DataTableActions/entityConfig';

	let {
		id,
		entityType,
		deleteFunction,
		onDeleted,
		onView,
		onDetails,
		showView,
		showDetails,
		showDelete,
		showCopy
	}: ActionButtonProps = $props();

	// Get default action visibility based on entityType
	const defaultVisibility = $derived(() => getEntityVisibilityConfig(entityType));

	// Use explicit props if provided, otherwise use defaults
	const finalShowView = $derived(showView ?? defaultVisibility().showView);
	const finalShowDetails = $derived(showDetails ?? defaultVisibility().showDetails);
	const finalShowDelete = $derived(showDelete ?? defaultVisibility().showDelete);
	const finalShowCopy = $derived(showCopy ?? defaultVisibility().showCopy);

	// Check if entityType has any actions available
	const hasVisibleActions = $derived(
		finalShowView || finalShowDetails || finalShowDelete || finalShowCopy
	);

	const dispatch = createEventDispatcher<{
		deleted: { id: string };
	}>();

	// Function to handle delete API call
	async function handleDelete(): Promise<void> {
		dialogStore.setLoading(true);
		console.log(`Deleting ${entityType} with ID ${id} `);
		try {
			await deleteFunction(id);

			// Call the callback function if provided
			if (onDeleted) {
				onDeleted(id);
			}

			// Close dialog and show success
			dialogStore.close();
			dialogStore.success(
				`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Deleted`,
				`The ${entityType} has been successfully deleted.`
			);

		} catch (error) {
			console.error(`Error deleting ${entityType}:`, error);
			dialogStore.close();
			dialogStore.error(
				'Delete Failed',
				`Failed to delete the ${entityType}. Please try again.`
			);
		}
	}

	function confirmDelete(): void {
		console.log('Display Dialog');
		dialogStore.confirmDelete({
			title: `Delete ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
			description: `This action cannot be undone. This will permanently delete the ${entityType} and all associated data.`,
			confirmText: `Delete ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
			loadingText: 'Deleting...',
			onConfirm: handleDelete
		});
	}

	function handleView(): void {
		if (onView) {
			onView(id);
		} else {
			console.log(`View ${entityType} with ID: ${id}`);
			// Default view behavior - you could navigate to a generic view page
		}
	}

	function handleDetails(): void {
		if (onDetails) {
			onDetails(id);
		} else {
			console.log(`Show details for ${entityType} with ID: ${id}`);
			// Default details behavior - you could open a generic details modal
		}
	}

	async function handleCopy(): Promise<void> {
		try {
			await navigator.clipboard.writeText(id);
			// Optional: show success toast
			console.log(`${entityType} ID ${id} copied to clipboard`);
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
		}
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
		{#if hasVisibleActions}
			<DropdownMenu.Group>
				<DropdownMenu.Label>Actions</DropdownMenu.Label>
				{#if finalShowCopy}
					<DropdownMenu.Item onclick={handleCopy} class="flex items-center gap-2">
						<CopyIcon size={16} />
						{$translation.action.copyToClipboard}
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Group>
			{#if finalShowView || finalShowDetails}
				<DropdownMenu.Separator />
				{#if finalShowView}
					<DropdownMenu.Item class="flex items-center gap-2">
						<EyeIcon size={16} />
						{$translation.action.view}
					</DropdownMenu.Item>
				{/if}
				{#if finalShowDetails}
					<DropdownMenu.Item class="flex items-center gap-2">
						<InfoIcon size={16} />
						{$translation.action.details}
					</DropdownMenu.Item>
				{/if}
			{/if}

			{#if finalShowDelete}
				<DropdownMenu.Item
					onclick={confirmDelete}
					class="flex items-center gap-2 text-red-600 focus:text-red-600">
					<Trash2 size={16} />
					{$translation.action.delete}
				</DropdownMenu.Item>
			{/if}
		{:else }
			<DropdownMenu.Group>
				<DropdownMenu.Label class="text-muted-foreground">{$translation.action.noAvailableAction}</DropdownMenu.Label>
			</DropdownMenu.Group>
		{/if}

	</DropdownMenu.Content>
</DropdownMenu.Root>
