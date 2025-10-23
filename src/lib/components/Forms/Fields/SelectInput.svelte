<!-- src/lib/components/Forms/Fields/SelectInput.svelte -->
<script lang="ts">
	import { ChevronDown, Check, Search, X } from 'lucide-svelte';
	import type { FormField, FieldOption } from '$lib/types/entities/forms';
	import { onMount } from 'svelte';
	import FormValidationIndicator from '$lib/components/Forms/FormValidationIndicator.svelte';

	// Extended option type with description support
	interface SelectOption extends FieldOption {
		description?: string;
	}

	interface Props {
		field: FormField;
		value: string;
		error?: string;
		showError?: boolean;
		disabled?: boolean;
		onChange: (fieldName: string, value: any) => void;
	}

	let {
		field,
		value,
		error,
		showError = false,
		disabled = false,
		onChange
	}: Props = $props();

	// Component state
	let showDropdown = $state(false);
	let isHovered = $state(false);
	let originalValue = $state(value);  // Track the ORIGINAL value (on mount/reset)
	let previousValue = $state(value);  // Track previous value for reset detection
	let buttonRef: HTMLButtonElement;
	let dropdownRef: HTMLDivElement;
	let portalContainer: HTMLDivElement;
	let dropdownPosition = $state({ top: 0, left: 0, width: 0 });
	let searchQuery = $state('');

	// Compute if value has changed from original
	const hasChanged = $derived(value !== originalValue);

	// Reset originalValue when value changes externally (e.g., form discard/reset)
	$effect(() => {
		// Detect external value changes (not from user selection)
		if (value !== previousValue) {
			// If dropdown is closed, this is likely a programmatic change (discard/reset)
			if (!showDropdown) {
				originalValue = value;  // Update original value on external change
				console.log('[SelectInput] 🔄 Reset detected for:', field.name, { newOriginal: value });
			}
			previousValue = value;
		}
	});

	// Get selected option
	let selectedOption = $derived(
		(field.options as SelectOption[])?.find(opt => opt.value === value)
	);

	let placeholder = $derived(field.placeholder || 'Select an option...');

	// Filter options based on search
	let filteredOptions = $derived(() => {
		if (!searchQuery || !field.searchable) {
			return (field.options as SelectOption[]) || [];
		}
		return ((field.options as SelectOption[]) || []).filter(option =>
			option.label.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	// Create portal container
	onMount(() => {
		portalContainer = document.createElement('div');
		portalContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 99999;';
		document.body.appendChild(portalContainer);

		return () => {
			if (portalContainer && portalContainer.parentNode) {
				portalContainer.parentNode.removeChild(portalContainer);
			}
		};
	});

	// Move dropdown to portal when it opens
	$effect(() => {
		if (showDropdown && dropdownRef && portalContainer) {
			portalContainer.appendChild(dropdownRef);
		}
	});

	function toggleDropdown() {
		if (disabled) return;
		showDropdown = !showDropdown;
		if (showDropdown) {
			searchQuery = '';
			setTimeout(() => updateDropdownPosition(), 0);
		}
	}

	function handleSelect(optionValue: string) {
		previousValue = optionValue;  // Update tracked value
		onChange(field.name, optionValue);
		showDropdown = false;
		searchQuery = '';
	}

	function clearSelection(e: Event) {
		e.stopPropagation();
		previousValue = '';  // Update tracked value
		onChange(field.name, '');
	}

	function updateDropdownPosition() {
		if (!buttonRef) return;

		const rect = buttonRef.getBoundingClientRect();
		const maxDropdownHeight = 300; // Max height for dropdown
		const viewportHeight = window.innerHeight;

		const spaceBelow = viewportHeight - rect.bottom;
		const spaceAbove = rect.top;

		const shouldOpenUpward = spaceBelow < maxDropdownHeight && spaceAbove > spaceBelow;

		if (shouldOpenUpward) {
			dropdownPosition = {
				top: rect.top - Math.min(maxDropdownHeight, spaceAbove - 16) - 4,
				left: rect.left,
				width: rect.width
			};
		} else {
			dropdownPosition = {
				top: rect.bottom + 4,
				left: rect.left,
				width: rect.width
			};
		}

		// Horizontal bounds
		const maxLeft = window.innerWidth - rect.width - 16;
		if (dropdownPosition.left > maxLeft) {
			dropdownPosition.left = maxLeft;
		}
		if (dropdownPosition.left < 16) {
			dropdownPosition.left = 16;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (!showDropdown) return;
		const target = event.target as Node;
		const clickedButton = buttonRef && buttonRef.contains(target);
		const clickedDropdown = dropdownRef && dropdownRef.contains(target);
		if (!clickedButton && !clickedDropdown) {
			showDropdown = false;
			searchQuery = '';
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			showDropdown = false;
			searchQuery = '';
		}
	}

	const borderGradient = $derived(() => {
		if (disabled) return '';
		if (showError) return 'from-red-400 to-red-500';
		if (showDropdown) return 'from-indigo-500 via-purple-500 to-pink-500';
		if (selectedOption && hasChanged) return 'from-emerald-400 to-teal-500';  // Only show green if changed
		if (isHovered) return 'from-slate-400 to-slate-500';
		return '';
	});

	const bgStyle = $derived(() => {
		if (disabled) return 'bg-slate-50';
		if (showError) return 'bg-red-50/50';
		if (selectedOption && !showDropdown && hasChanged) return 'bg-emerald-50/20';  // Only show green if changed
		if (showDropdown) return 'bg-indigo-50/30';
		if (isHovered) return 'bg-slate-50';
		return 'bg-white';
	});

	$effect(() => {
		if (showDropdown) {
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
	<div class="relative rounded-xl p-[2px] transition-all duration-200 {borderGradient() ? `bg-gradient-to-r ${borderGradient()}` : 'bg-slate-300'}">
		<div class="relative bg-white rounded-[11px]">
			<button
				bind:this={buttonRef}
				type="button"
				onclick={toggleDropdown}
				onmouseenter={() => isHovered = true}
				onmouseleave={() => isHovered = false}
				class="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-[11px] transition-all duration-200 text-left min-h-[44px] {bgStyle()} {disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} {showDropdown ? 'shadow-lg shadow-indigo-100/50' : 'shadow-sm'}"
				disabled={disabled}
			>
				{#if selectedOption}
					<!-- Selected Option -->
					<div class="flex-1 min-w-0">
						<span class="block text-sm font-medium text-slate-900 truncate leading-tight">
							{selectedOption.label}
						</span>
						{#if selectedOption.description}
							<span class="block text-xs text-slate-500 truncate leading-tight">
								{selectedOption.description}
							</span>
						{/if}
					</div>
					{#if !disabled && !field.required}
						<button
							type="button"
							onclick={clearSelection}
							class="flex-shrink-0 p-1.5 rounded-md hover:bg-red-100 transition-colors group"
							title="Clear selection"
						>
							<X class="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
						</button>
					{/if}
				{:else}
					<!-- Placeholder -->
					<div class="flex-1 min-w-0">
						<span class="block text-sm text-slate-500 truncate">
							{placeholder}
						</span>
					</div>
				{/if}

				<!-- Chevron Icon -->
				<div class="flex-shrink-0">
					<div class="p-1 rounded-md transition-all duration-200 {showDropdown ? 'bg-indigo-100' : isHovered && !disabled ? 'bg-slate-100' : ''}">
						<ChevronDown class="w-4 h-4 transition-transform duration-300 {showDropdown ? 'rotate-180 text-indigo-600' : 'text-slate-400'}" />
					</div>
				</div>
			</button>

			<!-- Validation Indicator -->
			<div class="absolute right-12 top-1/2 -translate-y-1/2">
				<FormValidationIndicator
					hasValue={!!selectedOption}
					hasError={!!error}
					showError={showError}
					isTouched={hasChanged}
					variant="default"
				/>
			</div>
		</div>
	</div>
</div>

<!-- Dropdown (will be moved to portal) -->
{#if showDropdown && !disabled}
	<div
		bind:this={dropdownRef}
		class="bg-white border border-slate-200 rounded-xl shadow-2xl shadow-indigo-100/50 overflow-hidden animate-slide-down"
		style="position: fixed; top: {dropdownPosition.top}px; left: {dropdownPosition.left}px; width: {dropdownPosition.width}px; pointer-events: auto;"
	>
		<!-- Search Header (if searchable) -->
		{#if field.searchable}
			<div class="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search options..."
						class="w-full pl-10 pr-3 py-2 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
						onclick={(e) => e.stopPropagation()}
					/>
				</div>
			</div>
		{/if}

		<!-- Options List -->
		<div class="max-h-60 overflow-y-auto custom-scrollbar">
			{#if filteredOptions().length > 0}
				<div class="py-1">
					{#each filteredOptions() as option}
						<button
							type="button"
							onclick={() => handleSelect(option.value)}
							disabled={option.disabled}
							class="w-full px-4 py-2.5 text-left transition-colors flex items-center gap-3 {
								option.disabled
									? 'opacity-50 cursor-not-allowed'
									: option.value === value
										? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900'
										: 'hover:bg-slate-50 text-slate-700'
							}"
						>
							<div class="flex-1 min-w-0">
								<div class="text-sm font-medium truncate">
									{option.label}
								</div>
								{#if option.description}
									<div class="text-xs text-slate-500 truncate">
										{option.description}
									</div>
								{/if}
							</div>
							{#if option.value === value}
								<Check class="w-4 h-4 text-indigo-600 flex-shrink-0" />
							{/if}
						</button>
					{/each}
				</div>
			{:else}
				<div class="px-4 py-8 text-center text-slate-500">
					<Search class="w-8 h-8 mx-auto mb-2 text-slate-300" />
					<p class="text-sm">No options found</p>
				</div>
			{/if}
		</div>

		<!-- Footer -->
		{#if filteredOptions().length > 0}
			<div class="px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 text-xs text-slate-600">
				{filteredOptions().length} option{filteredOptions().length !== 1 ? 's' : ''} available
			</div>
		{/if}
	</div>
{/if}

<style>
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

    .animate-slide-down {
        animation: slide-down 0.2s ease-out;
    }

    /* Custom scrollbar */
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