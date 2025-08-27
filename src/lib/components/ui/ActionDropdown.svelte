<script lang="ts">

	import { type ActionDropdownProps, getActionStyle } from '$lib/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Component } from 'svelte';

	let {
		itemId,
		itemTitle = '',
		actions = [],
		buttonVariant = 'outline',
		buttonSize = 'sm',
		disabled = false,
		dropdownWidth = 'w-64',
		position = 'right',
		isOpen: controlledIsOpen = undefined,
		onaction,
		onopen,
		onclose
	}: ActionDropdownProps = $props();

	// State - use controlled state if provided, otherwise internal state
	let internalIsOpen = $state(false);
	// Computed: Use controlled state if provided, otherwise internal
	const isOpen = $derived(controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen);

	let dropdownElement: HTMLDivElement;

	// Methods to control dropdown
	export function open() {
		console.log("open");
		if (!disabled) {
			if (controlledIsOpen === undefined) {
				internalIsOpen = true;
			}
			onopen?.({ itemId });
		}
	}

	export function close() {
		if (isOpen) {
			if (controlledIsOpen === undefined) {
				internalIsOpen = false;
			}
			onclose?.({ itemId });
		}
	}

	export function toggle() {
		console.log("Action Dropdown Toggled")
		if (isOpen) {
			close();
		} else {
			open();
		}
	}

	// Internal Handlers
	function handleButtonClick(event: MouseEvent) {
		event.stopPropagation();
		toggle();
	}

	function handleActionClick(actionId: string, event: MouseEvent) {
		event.stopPropagation();
		close();
		onaction?.({ actionId, itemId})
	}

	function handleDocumentClick(event: MouseEvent) {
		if (isOpen && dropdownElement && !dropdownElement.contains(event.target as Node)) {
			close()
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			close();
		}
	}

	// Safe icon rendering helper
	function isValidComponent(component: any): component is Component {
		return component && (
			typeof component === 'function' ||
			(typeof component === 'object' && component.$$typeof));
	}
</script>

<!-- Document and window event listeners -->
<svelte:document onclick={handleDocumentClick} onkeydown={handleKeydown} />

<!-- Dropdown Container -->
<div
	bind:this={dropdownElement}
	class="dropdown-container relative"
	class:z-50={isOpen}
	class:z-10={!isOpen}
	onclick={(e) => e.stopPropagation()}
	role="none"
>
	<!-- Trigger Button -->
	<Button
		variant={buttonVariant}
		size={buttonSize}
		onclick={handleButtonClick}
		{disabled}
		class="relative transition-all duration-200 {isOpen
			? 'ring-2 ring-indigo-500 bg-indigo-50 border-indigo-300 shadow-md'
			: 'hover:bg-slate-50 hover:border-slate-300'}"
		aria-label="Actions for {itemTitle}"
		aria-expanded={isOpen}
		aria-haspopup="menu"
	>
		<MoreHorizontal class="w-4 h-4 transition-transform duration-200 {isOpen ? 'rotate-90' : ''}" />
	</Button>

	<!-- Dropdown Menu -->
	{#if isOpen}
		<!-- Backdrop -->
		<div
			class="fixed inset-0 bg-transparent z-40"
			onclick={close}
			aria-hidden="true"
		></div>

		<div
			class="absolute {position === 'right' ? 'right-0' : 'left-0'} top-full mt-3 {dropdownWidth} bg-white border border-slate-200/60 rounded-xl shadow-xl backdrop-blur-sm overflow-hidden z-50 action-dropdown-menu"
			role="menu"
			aria-orientation="vertical"
		>
			<!-- Header (if itemTitle is provided) -->
			{#if itemTitle}
				<div class="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/60">
					<h4 class="text-sm font-semibold text-slate-800 truncate">
						{itemTitle}
					</h4>
					<p class="text-xs text-slate-500 mt-1">Choose an action</p>
				</div>
			{/if}

			<!-- Action Groups -->
			{#each actions as group, groupIndex}
				<div class="py-2">
					<!-- Group Title -->
					{#if group.title}
						<div class="px-3 py-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
							{group.title}
						</div>
					{/if}

					<!-- Group Items -->
					{#each group.items as action}
						<button
							type="button"
							onclick={(e) => handleActionClick(action.id, e)}
							disabled={action.disabled}
							class="group flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 transition-all duration-200 text-left focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed {getActionStyle(action.variant)}"
							role="menuitem"
						>
							<div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center transition-all duration-200 {action.disabled ? 'opacity-50' : ''}">
								<!-- Safe icon rendering with error handling -->
								{#if isValidComponent(action.icon)}
									{@const IconComponent = action.icon}
									<IconComponent class="w-4 h-4 text-slate-500" />
								{:else}
									<!-- Fallback icon -->
									<div class="w-4 h-4 bg-slate-400 rounded-sm"></div>
								{/if}
							</div>
							<div class="flex-1">
								<span class="font-medium">{action.label}</span>
								{#if action.description}
									<p class="text-xs text-slate-500">{action.description}</p>
								{/if}
							</div>
						</button>

						<!-- Separator -->
						{#if action.separator}
							<div class="border-t border-slate-200/60 my-1"></div>
						{/if}
					{/each}
				</div>

				<!-- Group Separator -->
				{#if groupIndex < actions.length - 1}
					<div class="border-t border-slate-200/60 my-1"></div>
				{/if}
			{/each}
		</div>
	{/if}
</div>


<style>
    /* Animation for dropdown */
    .action-dropdown-menu {
        animation: dropdownFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        transform-origin: top right;
    }

    @keyframes dropdownFadeIn {
        0% {
            opacity: 0;
            transform: scale(0.92) translateY(-12px) translateX(4px);
            filter: blur(4px);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0) translateX(0);
            filter: blur(0);
        }
    }

    /* Enhanced hover effects */
    .action-dropdown-menu button[role="menuitem"] {
        transform: translateX(0);
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .action-dropdown-menu button[role="menuitem"]:hover:not(:disabled) {
        transform: translateX(4px);
    }

    .action-dropdown-menu button[role="menuitem"]:active:not(:disabled) {
        transform: translateX(2px) scale(0.98);
    }

    /* Icon container animations */
    .action-dropdown-menu button[role="menuitem"] > div:first-of-type {
        transform: scale(1) rotate(0deg);
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .action-dropdown-menu button[role="menuitem"]:hover:not(:disabled) > div:first-of-type {
        transform: scale(1.05) rotate(2deg);
    }

    /* Focus styles */
    .action-dropdown-menu button[role="menuitem"]:focus {
        box-shadow: inset 3px 0 0 currentColor;
        outline: none;
    }
</style>