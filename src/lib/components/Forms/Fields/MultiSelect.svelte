<!-- src/lib/components/Forms/Fields/MultiSelect.svelte -->
<script lang="ts">
	import { X, ChevronDown, Search, Check } from 'lucide-svelte';
	import type { FormField } from '$lib/types/entities/forms';

	interface SelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		field: FormField;
		value: string[] | null | undefined;
		error?: string;
		showError?: boolean;
		disabled?: boolean;
		onChange: (fieldName: string, value: string[]) => void;
	}

	let {
		field,
		value = [],
		error,
		showError = false,
		disabled = false,
		onChange
	}: Props = $props();

	// State
	let isOpen = $state(false);
	let searchQuery = $state('');
	let dropdownRef: HTMLDivElement;
	let buttonRef: HTMLButtonElement;
	let searchInputRef: HTMLInputElement;
	let dropdownPosition = $state({ top: 0, left: 0, width: 0 });

	// Ensure selectedValues is always an array
	let selectedValues = $derived(Array.isArray(value) ? value : []);

	// Get options from field configuration
	let options = $derived<SelectOption[]>(field.options || []);

	// Configuration
	let placeholder = $derived(field.placeholder || 'Select items...');
	let maxItems = $derived(field.maxItems);
	let minItems = $derived(field.minItems);
	let searchable = $derived(field.searchable ?? true);

	// Check limits
	let isAtMaxItems = $derived(maxItems !== undefined && selectedValues.length >= maxItems);

	// Filter options based on search
	let filteredOptions = $derived(() => {
		if (!searchQuery.trim()) return options;

		const query = searchQuery.toLowerCase();
		return options.filter(opt =>
			opt.label.toLowerCase().includes(query) ||
			opt.value.toLowerCase().includes(query)
		);
	});

	// Get available options (not yet selected)
	let availableOptions = $derived(() => {
		return filteredOptions().filter(opt => !selectedValues.includes(opt.value));
	});

	// Get selected option labels for display
	function getOptionLabel(value: string): string {
		const option = options.find(opt => opt.value === value);
		return option?.label || value;
	}

	// Add an item
	function addItem(optionValue: string) {
		if (disabled || isAtMaxItems) return;

		const newValues = [...selectedValues, optionValue];
		onChange(field.name, newValues);
		searchQuery = '';

		// Keep dropdown open unless at max
		if (maxItems && newValues.length >= maxItems) {
			closeDropdown();
		} else if (searchInputRef) {
			searchInputRef.focus();
		}
	}

	// Remove an item
	function removeItem(valueToRemove: string) {
		if (disabled) return;
		const newValues = selectedValues.filter(v => v !== valueToRemove);
		onChange(field.name, newValues);
	}

	// Toggle dropdown
	function toggleDropdown() {
		if (disabled) return;
		isOpen = !isOpen;

		if (isOpen) {
			updateDropdownPosition();
			setTimeout(() => {
				if (searchable && searchInputRef) {
					searchInputRef.focus();
				}
			}, 100);
		}
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

	// Close dropdown
	function closeDropdown() {
		isOpen = false;
		searchQuery = '';
	}

	// Handle click outside
	function handleClickOutside(event: MouseEvent) {
		if (!isOpen) return;

		const target = event.target as Node;
		const clickedButton = buttonRef?.contains(target);
		const clickedDropdown = dropdownRef?.contains(target);

		if (!clickedButton && !clickedDropdown) {
			closeDropdown();
		}
	}

	// Handle keyboard
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeDropdown();
		}
	}

	// Lifecycle
	$effect(() => {
		if (isOpen) {
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

	// Border styling
	const borderClass = $derived(() => {
		if (disabled) return 'border-slate-300';
		if (showError) return 'border-red-400 ring-2 ring-red-100';
		if (isOpen) return 'border-indigo-500 ring-2 ring-indigo-200';
		if (selectedValues.length > 0) return 'border-emerald-400';
		return 'border-slate-200';
	});

	// Background styling
	const bgClass = $derived(() => {
		if (disabled) return 'bg-slate-50';
		if (showError) return 'bg-red-50/30';
		return 'bg-white';
	});
</script>

<div class="relative">
	<!-- Main Button -->
	<button
		bind:this={buttonRef}
		type="button"
		onclick={toggleDropdown}
		disabled={disabled}
		class="w-full min-h-[56px] p-3 border-2 rounded-lg transition-all duration-200 text-left {borderClass()} {bgClass()} {disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}"
	>
		<!-- Selected Items -->
		<div class="flex flex-wrap gap-1.5 mb-1">
			{#each selectedValues as selectedValue (selectedValue)}
				<div
					class="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-full shadow-sm hover:shadow-md transition-all animate-scale-in group"
				>
					<span>{getOptionLabel(selectedValue)}</span>
					<button
						type="button"
						onclick={(e) => {
							e.stopPropagation();
							removeItem(selectedValue);
						}}
						disabled={disabled}
						class="p-0.5 hover:bg-white/20 rounded-full transition-colors"
						aria-label="Remove {getOptionLabel(selectedValue)}"
					>
						<X class="w-3 h-3" />
					</button>
				</div>
			{/each}
		</div>

		<!-- Placeholder or "Add more" text -->
		<div class="flex items-center justify-between">
			<span class="text-xs {selectedValues.length > 0 ? 'text-slate-500' : 'text-slate-400'}">
				{#if selectedValues.length === 0}
					{placeholder}
				{:else if isAtMaxItems}
					Maximum items selected
				{:else}
					Click to add more...
				{/if}
			</span>

			<!-- Chevron Icon -->
			<ChevronDown
				class="w-4 h-4 text-slate-400 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
			/>
		</div>
	</button>

	<!-- Dropdown Portal (rendered at body level to avoid clipping) -->
	{#if isOpen && !disabled}
		<div
			bind:this={dropdownRef}
			class="fixed z-[9999] bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden animate-slide-down"
			style="top: {dropdownPosition.top}px; left: {dropdownPosition.left}px; width: {dropdownPosition.width}px;"
		>
			<!-- Search Header (if searchable) -->
			{#if searchable}
				<div class="p-3 border-b border-slate-200 bg-slate-50">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<input
							bind:this={searchInputRef}
							type="text"
							bind:value={searchQuery}
							placeholder="Search..."
							class="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							onclick={(e) => e.stopPropagation()}
						/>
					</div>
				</div>
			{/if}

			<!-- Options List -->
			<div class="max-h-64 overflow-y-auto">
				{#if availableOptions().length > 0}
					<div class="py-1">
						{#each availableOptions() as option (option.value)}
							<button
								type="button"
								onclick={(e) => {
									e.stopPropagation();
									addItem(option.value);
								}}
								disabled={option.disabled || isAtMaxItems}
								class="w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-50 transition-colors flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span class="text-slate-700 group-hover:text-indigo-700">
									{option.label}
								</span>
								<Check class="w-4 h-4 text-transparent group-hover:text-indigo-500" />
							</button>
						{/each}
					</div>
				{:else}
					<div class="py-8 text-center text-slate-500">
						<Search class="w-8 h-8 mx-auto mb-2 text-slate-300" />
						<p class="text-sm">
							{searchQuery ? 'No matching items found' : 'All items selected'}
						</p>
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
				<span class="text-slate-600 font-medium">
					{selectedValues.length} of {options.length} selected
				</span>

				{#if maxItems}
					<span class="text-slate-500">
						Max: {maxItems}
					</span>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Error Message -->
	{#if showError && error}
		<p class="mt-1.5 text-sm text-red-600 animate-shake flex items-center gap-1">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			{error}
		</p>
	{/if}

	<!-- Helper Text / Limits -->
	<div class="mt-1.5 flex items-center justify-between text-xs">
		<div class="flex items-center gap-4">
			{#if selectedValues.length > 0}
				<span class="text-slate-500 font-medium">
					{selectedValues.length} item{selectedValues.length !== 1 ? 's' : ''} selected
				</span>
			{/if}

			{#if minItems && selectedValues.length < minItems}
				<span class="text-amber-600 font-medium">
					Minimum {minItems} required
				</span>
			{/if}
		</div>

		{#if maxItems}
			<span class="text-slate-400">
				{#if isAtMaxItems}
					<span class="text-amber-600 font-medium">Maximum reached</span>
				{:else}
					Max: {maxItems}
				{/if}
			</span>
		{/if}
	</div>

</div>

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

    .animate-slide-down {
        animation: slide-down 0.2s ease-out;
    }

    .animate-shake {
        animation: shake 0.3s ease-out;
    }
</style>