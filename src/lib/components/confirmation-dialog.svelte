<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { DialogType, DialogVariant } from '$lib/types/dialog';
	import { createEventDispatcher } from 'svelte';

	export let open: boolean = false;
	export let title: string = "Confirm Action";
	export let description: string = "Are you sure you want to proceed?";
	export let variant: DialogVariant = "destructive";
	export let type: DialogType = "confirmation";
	export let confirmText: string = "Confirm";
	export let cancelText: string = "Cancel";
	export let closeText: string = "Close";
	export let isLoading: boolean = false;
	export let loadingText: string = "Processing...";

	const dispatch = createEventDispatcher();

	// Variant styles
	const variantStyles: Record<DialogVariant, string> = {
		destructive: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
		default: "bg-primary hover:bg-primary/90",
		info: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600",
		success: "bg-green-600 hover:bg-green-700 focus:ring-green-600",
		warning: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600"
	};

	// Icon mapping for different variants
	const variantIcons: Record<DialogVariant, string> = {
		destructive: "⚠️",
		default: "❓",
		info: "ℹ️",
		success: "✅",
		warning: "⚠️"
	};

	function handleConfirm() {
		dispatch('confirm');
	}

	function handleCancel() {
		dispatch('cancel');
	}

	function handleClose() {
		dispatch('close');
		open = false;
	}
</script>


<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="flex items-center gap-2">
				<span class="text-lg">{variantIcons[variant]}</span>
				{title}
			</AlertDialog.Title>
			<AlertDialog.Description class="text-sm text-muted-foreground">
				{description}
			</AlertDialog.Description>
		</AlertDialog.Header>

		<AlertDialog.Footer>
			{#if type === "confirmation"}
				<!-- Confirmation dialog with Cancel and Confirm buttons -->
				<AlertDialog.Cancel onclick={handleCancel}>
					{cancelText}
				</AlertDialog.Cancel>
				<AlertDialog.Action
					onclick={handleConfirm}
					disabled={isLoading}
					class={variantStyles[variant]}
				>
					{isLoading ? loadingText : confirmText}
				</AlertDialog.Action>
			{:else}
				<!-- Notification dialog with just Close button -->
				<AlertDialog.Action
					onclick={handleClose}
					class={variantStyles[variant]}
				>
					{closeText}
				</AlertDialog.Action>
			{/if}
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>