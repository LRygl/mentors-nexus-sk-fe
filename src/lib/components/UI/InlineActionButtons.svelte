<script lang="ts">
	import { type ActionEvent, type ActionGroup, type ActionItem, ActionType } from '$lib/types';
	import ActionDropdown from '$lib/components/UI/ActionDropdown.svelte';
	import DynamicIcon from '$lib/components/UI/DynamicIcon.svelte';

	interface Props {
		itemId: string;
		itemTitle: string;
		actions: ActionGroup[];
		onAction?: (event: ActionEvent) => void;
		maxVisible?: number;
		// Dropdown props for overflow actions
		openDropdownId?: string;
		onDropdownOpen?: (event: { itemId: string }) => void;
		onDropdownClose?: (event: { itemId: string }) => void;
	}

	let {
		itemId,
		itemTitle,
		actions,
		onAction,
		maxVisible = 3,
		openDropdownId,
		onDropdownOpen,
		onDropdownClose
	}: Props = $props();

	const allActions = actions.flatMap(group => group.items);
	const visibleActions = allActions.slice(0, maxVisible);
	const overflowActions = allActions.slice(maxVisible);

	const isDropdownOpen = $derived(openDropdownId !== undefined && openDropdownId === itemId);
	function handleAction(actionId: string, itemId: string) {
		onAction?.({ actionId, itemId });
	}

	function handleDropdownAction(event: { actionId: string; itemId: string }) {
		onAction(event.actionId);
	}

	function getButtonVariant(action: ActionItem): string {
		switch (action.variant) {
			case ActionType.DANGER:
				return 'hover:bg-red-50 hover:text-red-700 hover:border-red-300';
			case ActionType.WARNING:
				return 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300';
			case ActionType.SUCCESS:
				return 'hover:bg-green-50 hover:text-green-700 hover:border-green-300';
			default:
				return 'hover:bg-slate-50';
		}
	}

	function getIconClass(action: ActionItem): string {
		switch (action.variant) {
			case ActionType.DANGER:
				return 'text-slate-500 group-hover:text-red-600';
			case ActionType.WARNING:
				return 'text-slate-500 group-hover:text-amber-600';
			case ActionType.SUCCESS:
				return 'text-slate-500 group-hover:text-green-600';
			default:
				return 'text-slate-500';
		}
	}

</script>

<div class="flex items-center justify-center">
	{#if visibleActions.length > 0}
		<!-- Button group for visible actions -->
		<div class="inline-flex rounded-md shadow-sm" role="group">
			{#each visibleActions as action, index}
				<button
					type="button"
					onclick={() => handleAction(action.id, itemId)}
					disabled={action.disabled}
					title={action.description || action.label}
					class="group relative inline-flex items-center justify-center px-2 py-1.5 text-sm font-medium border border-slate-300 bg-white text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            {index === 0 ? 'rounded-l-md' : ''}
            {index === visibleActions.length - 1 && overflowActions.length === 0 ? 'rounded-r-md' : ''}
            {index > 0 ? '-ml-px' : ''}
            {getButtonVariant(action)}"
				>
					{#if action.icon}
						<DynamicIcon
							iconName={action.icon}
							class="{getIconClass(action)} w-4 h-4"
							size={16}
						/>
					{/if}
				</button>
			{/each}

			{#if overflowActions.length > 0}
				<!-- More actions dropdown as part of button group
				<div class="-ml-px">
					<ActionDropdown
						{itemId}
						{itemTitle}
						actions={[{ title: 'More Actions', items: overflowActions }]}
						buttonVariant="outline"
						buttonSize="sm"
						position="right"
						isOpen={isDropdownOpen}
						onaction={handleDropdownAction}
						onopen={onDropdownOpen}
						onclose={onDropdownClose}
						class="rounded-l-none rounded-r-md border-l-0"
					/>

				</div>
							-->
			{/if}
		</div>
	{/if}
</div>