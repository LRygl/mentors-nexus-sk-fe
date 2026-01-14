<!-- src/lib/components/ui/IconSelectInput.svelte -->
<script lang="ts">
	import { Search, ChevronDown, Sparkles, AlertCircle } from 'lucide-svelte';
	import { availableIcons, getIconComponent, getIconDisplayName, searchIcons } from '$lib/types/params/iconRegistry';
	import DynamicIcon from '../../UI/DynamicIcon.svelte';
	import type { IconData } from '$lib/types/params/iconRegistry';
	import type { FormField } from '$lib/types/entities/forms';

	interface Props {
		field: FormField;
		value: string | null | undefined;
		error?: string;
		showError?: boolean;
		disabled?: boolean;
		onChange: (fieldName: string, value: string) => void;
	}

	let {
		field,
		value,
		error,
		showError = false,
		disabled = false,
		onChange
	}: Props = $props();

	// Map field props to internal component props
	let selectedIcon = $derived(value);
	let label = $derived(field.label);
	let isOpening = $state(false);
	let placeholder = $derived(field.placeholder || 'Choose an icon...');
	let previewColor = $derived(field.iconColor || '#3B82F6');

	function handleSelect(iconName: string) {
		onChange(field.name, iconName);
	}

	// Component state
	let showIconSelector = $state(false);
	let iconSearchQuery = $state('');
	let dropdownRef: HTMLDivElement;
	let buttonRef: HTMLButtonElement;
	let isHovered = $state(false);
	let isFocused = $state(false);
	let dropdownPosition = $state({ top: 0, left: 0, width: 0 });

	// Filtered icons based on search
	let filteredIcons = $state<IconData[]>([]);

	// Update filtered icons when search changes
	$effect(() => {
		filteredIcons = searchIcons(iconSearchQuery);
	});

	// Get current icon component
	let currentIconComponent = $state<any>();

	$effect(() => {
		currentIconComponent = getIconComponent(selectedIcon || '');
	});

	// Dynamic border gradient
	const borderGradient = $derived(() => {
		if (disabled) return '';
		if (showError) return 'from-red-400 to-red-500';
		if (showIconSelector) return 'from-indigo-500 via-purple-500 to-pink-500';
		if (selectedIcon) return 'from-emerald-400 to-teal-500';
		if (isHovered) return 'from-slate-400 to-slate-500';
		return '';
	});

	// Background styling
	const bgStyle = $derived(() => {
		if (disabled) return 'bg-slate-50';
		if (showError) return 'bg-red-50/50';
		if (selectedIcon && !showIconSelector) return 'bg-emerald-50/20';
		if (showIconSelector) return 'bg-indigo-50/30';
		if (isHovered) return 'bg-slate-50';
		return 'bg-white';
	});

	// Handle icon selection
	function handleIconSelect(iconName: string) {
		handleSelect(iconName);
		showIconSelector = false;
		iconSearchQuery = '';
	}

	// Update dropdown position
	function updateDropdownPosition() {
		if (buttonRef) {
			const rect = buttonRef.getBoundingClientRect();
			dropdownPosition = {
				top: rect.bottom + window.scrollY + 8,
				left: rect.left + window.scrollX,
				width: rect.width
			};
		}
	}

	// Handle opening/closing dropdown
	function toggleDropdown() {
		if (disabled) return;
		showIconSelector = !showIconSelector;
		if (showIconSelector) {
			updateDropdownPosition();
			// Small delay to prevent immediate close from same click
			setTimeout(() => {
				isOpening = false;
			}, 0);
		}
	}

	// Handle click outside to close dropdown
	function handleClickOutside(event: MouseEvent) {
		if (!showIconSelector || isOpening) return; // Early exit if already closed

		const target = event.target as Node;
		const clickedButton = buttonRef && buttonRef.contains(target);
		const clickedDropdown = dropdownRef && dropdownRef.contains(target);

		if (!clickedButton && !clickedDropdown) {
			showIconSelector = false;
			iconSearchQuery = '';
			isFocused = false;
		}
	}
	// Close dropdown on escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			showIconSelector = false;
			iconSearchQuery = '';
			isFocused = false;
		}
	}

	// Lifecycle
	$effect(() => {
		if (showIconSelector) {
			// Use capture phase (third parameter = true) to catch events early
			document.addEventListener('click', handleClickOutside, true);
			document.addEventListener('keydown', handleKeydown);
			window.addEventListener('scroll', updateDropdownPosition, true);
			window.addEventListener('resize', updateDropdownPosition);

			return () => {
				document.removeEventListener('click', handleClickOutside, true);
				document.removeEventListener('keydown', handleKeydown);
				window.removeEventListener('scroll', updateDropdownPosition, true);
				window.removeEventListener('resize', updateDropdownPosition);
			};
		}
	});
</script>

<div class="relative mb-2">
	<!-- Gradient Border Container -->
	<div class="relative rounded-xl p-[2px] transition-all duration-200 {borderGradient() ? `bg-gradient-to-r ${borderGradient()}` : 'bg-slate-300'}">
		<!-- Selector Button -->
		<div class="relative bg-white rounded-[11px]">
			<button
				bind:this={buttonRef}
				type="button"
				onclick={toggleDropdown}
				onmouseenter={() => isHovered = true}
				onmouseleave={() => isHovered = false}
				onfocus={() => isFocused = true}
				onblur={() => isFocused = false}
				class="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-[11px] transition-all duration-200 text-left {bgStyle()} {disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} {showIconSelector ? 'shadow-lg shadow-indigo-100/50' : 'shadow-sm'}"
				disabled={disabled}
			>
				{#if selectedIcon}
					<!-- Selected Icon Preview -->
					<div class="relative flex-shrink-0">
						<div
							class="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all duration-300 {isHovered && !disabled ? 'scale-105 shadow-md' : 'scale-100'}"
							style="background: linear-gradient(135deg, {previewColor}, {previewColor}dd);"
						>
							<DynamicIcon iconName={selectedIcon} class="text-white" size={20} />
						</div>
						{#if !disabled && !showError}
							<div class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-scale-in"></div>
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<span class="block text-sm font-medium text-slate-900 truncate">
							{getIconDisplayName(selectedIcon)}
						</span>
					</div>
				{:else}
					<!-- Placeholder State -->
					<div class="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0 transition-all duration-300 {isHovered && !disabled ? 'bg-slate-300' : ''}">
						<Search class="w-4 h-4 text-slate-400" />
					</div>
					<div class="flex-1 min-w-0">
						<span class="block text-sm text-slate-500 truncate">
							{placeholder}
						</span>
						<span class="block text-xs text-slate-400 truncate">
							Click to browse
						</span>
					</div>
				{/if}

				<!-- Chevron with rotation animation -->
				<div class="flex-shrink-0">
					<div class="p-1 rounded-md transition-all duration-200 {showIconSelector ? 'bg-indigo-100' : isHovered && !disabled ? 'bg-slate-100' : ''}">
						<ChevronDown class="w-4 h-4 transition-transform duration-300 {showIconSelector ? 'rotate-180 text-indigo-600' : 'text-slate-400'}" />
					</div>
				</div>
			</button>

			<!-- Error Icon -->
			{#if showError}
				<div class="absolute right-12 top-1/2 -translate-y-1/2 animate-shake">
					<AlertCircle class="w-4 h-4 text-red-500" />
				</div>
			{/if}
		</div>
	</div>

</div>

<!-- Icon Dropdown Portal (rendered at body level) -->
{#if showIconSelector && !disabled}
	<div
		bind:this={dropdownRef}
		class="fixed z-[9999] bg-white border border-slate-200 rounded-xl shadow-2xl shadow-indigo-100/50 overflow-hidden animate-slide-down"
		style="top: {dropdownPosition.top}px; left: {dropdownPosition.left}px; width: {dropdownPosition.width}px;"
	>
		<!-- Search Header -->
		<div class="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
			<div class="relative">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
				<input
					type="text"
					bind:value={iconSearchQuery}
					placeholder="Search icons..."
					class="w-full pl-10 pr-3 py-2.5 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white shadow-sm"
					autocomplete="off"
				/>
			</div>
		</div>

		<!-- Icons Grid -->
		<div class="p-3 max-h-72 overflow-y-auto custom-scrollbar">
			{#if filteredIcons.length > 0}
				<div class="grid grid-cols-4 gap-1">
					{#each filteredIcons as icon (icon.name)}
						{@const IconComp = icon.component}
						<button
							type="button"
							onclick={() => handleIconSelect(icon.name)}
							class="flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 group relative {selectedIcon === icon.name ? 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 shadow-md scale-105' : 'text-slate-600 hover:bg-slate-100 hover:scale-105 hover:shadow-sm'}"
							title={`${icon.displayName} (${icon.category})`}
						>
							<div class="w-5 h-5 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
								<IconComp class="w-4 h-4" />
							</div>
							<span class="text-[10px] font-medium truncate max-w-full leading-tight">
											{icon.displayName}
										</span>
							{#if selectedIcon === icon.name}
								<div class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white animate-scale-in"></div>
							{/if}
						</button>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-12 text-slate-500">
					<div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
						<Search class="w-8 h-8 text-slate-300" />
					</div>
					<p class="text-sm font-semibold text-slate-700">No icons found</p>
					<p class="text-xs text-slate-500 mt-1">Try adjusting your search terms</p>
				</div>
			{/if}
		</div>

		<!-- Footer with count and gradient -->
		<div class="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Sparkles class="w-3.5 h-3.5 text-indigo-500" />
				<span class="text-xs font-semibold text-slate-600">
								{filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} available
							</span>
			</div>
			{#if selectedIcon}
							<span class="text-xs text-emerald-600 font-medium">
								✓ Selected
							</span>
			{/if}
		</div>
	</div>
{/if}

<style>
    @keyframes scale-in {
        from {
            transform: scale(0);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes slide-down {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
    }

    .animate-scale-in {
        animation: scale-in 0.2s ease-out;
    }

    .animate-shake {
        animation: shake 0.3s ease-out;
    }

    .animate-slide-down {
        animation: slide-down 0.2s ease-out;
    }

    /* Custom scrollbar styling */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 3px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #818cf8, #a78bfa);
        border-radius: 3px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #6366f1, #9333ea);
    }
</style>