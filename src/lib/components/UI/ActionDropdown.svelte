<script lang="ts">
	import type { ActionDropdownProps } from '$lib/types';
	import { getActionStyle } from '$lib/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import type { Component } from 'svelte';
	import Portal from 'svelte-portal';
	import DynamicIcon from '$lib/components/UI/DynamicIcon.svelte';

	let {
		itemId,
		itemTitle = '',
		actions = [],
		disabled = false,
		isOpen: controlledIsOpen = undefined,
		onaction,
		onopen,
		onclose,
		class: additionalClass = ''
	}: ActionDropdownProps = $props();

	let internalIsOpen = $state(false);
	// Only use controlled state if explicitly provided and not undefined/null
	const isOpen = $derived(controlledIsOpen !== undefined && controlledIsOpen !== null ? controlledIsOpen : internalIsOpen);

	let buttonElement = $state<HTMLElement>();
	let dropdownPosition = $state({ top: 0, left: 0, calculated: false });

	function calculatePosition() {
		if (!buttonElement) return;

		const rect = buttonElement.getBoundingClientRect();
		const dropdownWidthPx = 256;
		const gap = 8;

		// Use fixed positioning relative to viewport
		let top = rect.bottom + gap;
		let left = rect.right - dropdownWidthPx;

		// Keep dropdown on screen
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		if (left < 8) {
			left = rect.left;
		}
		if (left + dropdownWidthPx > viewportWidth - 8) {
			left = viewportWidth - dropdownWidthPx - 8;
		}

		if (top + 300 > viewportHeight) {
			top = rect.top - gap - 300;
		}

		dropdownPosition = { top, left, calculated: true };
	}

	export function open() {
		if (!disabled) {
			calculatePosition();
			if (controlledIsOpen !== undefined) {
				onopen?.({ itemId });
			} else {
				internalIsOpen = true;
			}
		}
	}

	export function close() {
		if (controlledIsOpen !== undefined) {
			onclose?.({ itemId });
		} else {
			internalIsOpen = false;
		}
	}

	export function toggle() {
		if (isOpen) {
			close();
		} else {
			open();
		}
	}

	function handleButtonClick(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		toggle();
	}

	function handleActionClick(actionId: string, event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		close();
		onaction?.({ actionId, itemId });
	}

	function handleDocumentClick(event: MouseEvent) {
		if (isOpen) {
			const target = event.target as Element;
			if (!target.closest('.dropdown-content') && !target.closest('.action-dropdown')) {
				close();
			}
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			close();
		}
	}

	function isValidComponent(component: any): component is Component {
		return component && (
			typeof component === 'function' ||
			(typeof component === 'object' && component.$$typeof)
		);
	}

	// Recalculate position when dropdown opens
	$effect(() => {
		if (isOpen && buttonElement) {
			// Small delay to ensure DOM is ready
			setTimeout(calculatePosition, 0);
		}
	});

</script>

<svelte:document onclick={handleDocumentClick} onkeydown={handleKeydown} />

<!-- Button container -->
<div class="action-dropdown relative" data-item-id={itemId}>
	<button
		bind:this={buttonElement}
		type="button"
		onclick={handleButtonClick}
		{disabled}
		class="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-slate-300 bg-white hover:bg-slate-50 h-9 px-3 {isOpen
			? 'ring-2 ring-indigo-500 bg-indigo-50 border-indigo-300'
			: ''}"
		aria-label="Actions for {itemTitle}"
		aria-expanded={isOpen}
		aria-haspopup="menu"
	>
		<MoreHorizontal class="w-4 h-4 transition-transform duration-200 {isOpen ? 'rotate-90' : ''}" />
	</button>
</div>

<!-- Portal dropdown content to document body when open -->
{#if isOpen && dropdownPosition.calculated}
	<Portal>
	<div
		class="dropdown-content fixed w-64 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
		style="top: {dropdownPosition.top}px; left: {dropdownPosition.left}px; z-index: 99999;"
		role="menu"
	>
		{#if itemTitle}
			<div class="px-4 py-3 bg-slate-50 border-b border-slate-200">
				<h4 class="text-sm font-semibold text-slate-800 truncate">
					{itemTitle}
				</h4>
			</div>
		{/if}

		<div class="max-h-80 overflow-y-auto">
			{#each actions as group}
				<div class="py-1">
					{#if group.title}
						<div class="px-3 py-2 text-xs font-medium text-slate-500 uppercase">
							{group.title}
						</div>
					{/if}

					{#each group.items as action}
						<button
							type="button"
							onclick={(e) => handleActionClick(action.id, e)}
							disabled={action.disabled}
							class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left transition-colors disabled:opacity-50 {getActionStyle(action.variant)}"
							role="menuitem"
						>
							<div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
								{#if isValidComponent(action.icon)}
									{@const IconComponent = action.icon}
									<DynamicIcon
										iconName={action.icon}
									/>
									<!--
									<IconComponent class="w-4 h-4 text-slate-500" />
									-->
								{:else}
									<div class="w-3 h-3 bg-slate-400 rounded"></div>
								{/if}
							</div>
							<div class="flex-1 min-w-0">
								<div class="font-medium truncate">{action.label}</div>
								{#if action.description}
									<div class="text-xs text-slate-500 truncate">{action.description}</div>
								{/if}
							</div>
						</button>
					{/each}
				</div>
			{/each}
		</div>
	</div>
	</Portal>
{/if}