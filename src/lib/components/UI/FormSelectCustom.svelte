<!-- src/lib/components/UI/EnhancedSelect.svelte -->
<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	interface Option {
		label: string;
		value: any;
		searchText?: string;
		metadata?: {
			isPublished?: boolean;
			status?: string;
			statusColor?: string;
			icon?: string;
			description?: string;
			tags?: string[];
		};
	}

	interface Props {
		options: Option[];
		value?: any;
		placeholder?: string;
		searchable?: boolean;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		customRenderer?: boolean;
		showIcons?: boolean;
		showMetadata?: boolean;
		maxHeight?: string;
		className?: string;
	}

	let {
		options = [],
		value = $bindable(''),
		placeholder = 'Select an option...',
		searchable = false,
		required = false,
		disabled = false,
		error = '',
		customRenderer = false,
		showIcons = false,
		showMetadata = false,
		maxHeight = '200px',
		className = ''
	}: Props = $props();

	const dispatch = createEventDispatcher();

	// State
	let isOpen = $state(false);
	let searchTerm = $state('');
	let highlightedIndex = $state(-1);
	let searchInput: HTMLInputElement;
	let selectContainer: HTMLDivElement;

	// Computed
	const selectedOption = $derived(options.find(opt => opt.value === value));
	const filteredOptions = $derived(() => {
		if (!searchTerm) return options;

		const term = searchTerm.toLowerCase();
		return options.filter(option => {
			const searchIn = option.searchText || option.label;
			return searchIn.toLowerCase().includes(term);
		});
	});

	// Methods
	function toggleDropdown() {
		if (disabled) return;

		isOpen = !isOpen;
		if (isOpen && searchable) {
			setTimeout(() => searchInput?.focus(), 50);
		}
	}

	function selectOption(option: Option) {
		value = option.value;
		isOpen = false;
		searchTerm = '';
		highlightedIndex = -1;
		dispatch('change', { value: option.value, option });
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!isOpen) {
			if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
				event.preventDefault();
				isOpen = true;
			}
			return;
		}

		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				isOpen = false;
				searchTerm = '';
				break;

			case 'ArrowDown':
				event.preventDefault();
				highlightedIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
				break;

			case 'ArrowUp':
				event.preventDefault();
				highlightedIndex = Math.max(highlightedIndex - 1, -1);
				break;

		}
	}

	function handleClickOutside() {
		isOpen = false;
		searchTerm = '';
		highlightedIndex = -1;
	}

	// Icon component mapping - you'd import your actual icon components
	function getIconComponent(iconName: string) {
		// This would map to your actual icon components
		return iconName || 'HelpCircle';
	}
</script>

<div
	bind:this={selectContainer}
	class="relative {className}"
	use:clickOutside={handleClickOutside}
>
	<!-- Select Button -->
	<button
		type="button"
		class="relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-3 pr-10 text-left text-slate-900 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors {disabled ? 'bg-slate-50 cursor-not-allowed' : ''} {error ? 'border-red-300 bg-red-50' : ''}"
		{disabled}
		onclick={toggleDropdown}
		onkeydown={handleKeydown}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
	>
		<span class="flex items-center">
			{#if selectedOption}
				{#if showIcons && selectedOption.metadata?.icon}
					<span class="mr-2 text-gray-400">
						<!-- Icon would go here based on selectedOption.metadata.icon -->
						🔍
					</span>
				{/if}
				<span class="block truncate">{selectedOption.label}</span>
				{#if showMetadata && selectedOption.metadata?.status}
					<span class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {selectedOption.metadata.statusColor === 'green' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}">
						{selectedOption.metadata.status}
					</span>
				{/if}
			{:else}
				<span class="block truncate text-slate-500">{placeholder}</span>
			{/if}
		</span>
		<span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
			<svg class="h-4 w-4 text-slate-400 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
			</svg>
		</span>
	</button>

	<!-- Dropdown -->
	{#if isOpen}
		<div
			class="absolute z-10 mt-1 w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-200"
			style="max-height: {maxHeight};"
		>
			<!-- Search Input -->
			{#if searchable}
				<div class="p-2 border-b border-slate-100">
					<input
						bind:this={searchInput}
						bind:value={searchTerm}
						type="text"
						placeholder="Search options..."
						class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						onkeydown={handleKeydown}
					/>
				</div>
			{/if}

			<!-- Options List -->
			<div class="overflow-y-auto" style="max-height: calc({maxHeight} - 60px);">
				{#if filteredOptions.length === 0}
					<div class="px-3 py-6 text-center text-sm text-slate-500">
						{searchTerm ? `No results found for "${searchTerm}"` : 'No options available'}
					</div>
				{:else}
					{#each filteredOptions as option, index}
						<button
							type="button"
							class="relative w-full cursor-pointer select-none py-3 pl-3 pr-9 text-left hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none transition-colors {highlightedIndex === index ? 'bg-indigo-50' : ''} {option.value === value ? 'bg-indigo-100' : ''}"
							onclick={() => selectOption(option)}
							onmouseenter={() => highlightedIndex = index}
						>
							<div class="flex items-center justify-between">
								<div class="flex items-center flex-1 min-w-0">
									{#if showIcons && option.metadata?.icon}
										<span class="mr-2 text-slate-400 flex-shrink-0">
											<!-- Icon component would go here -->
											🔍
										</span>
									{/if}
									<div class="flex-1 min-w-0">
										<div class="text-sm font-medium text-slate-900 truncate {option.value === value ? 'font-semibold' : ''}">
											{option.label}
										</div>
										{#if showMetadata && option.metadata?.description}
											<div class="text-xs text-slate-500 truncate mt-1">
												{option.metadata.description}
											</div>
										{/if}
									</div>
								</div>

								{#if showMetadata && option.metadata?.status}
									<span class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 {option.metadata.statusColor === 'green' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}">
										{option.metadata.status}
									</span>
								{/if}
							</div>

							{#if option.value === value}
								<span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
									<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
									</svg>
								</span>
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/if}

	<!-- Error Message -->
	{#if error}
		<p class="mt-2 text-xs text-red-600">{error}</p>
	{/if}
	{#if error}
		<p class="mt-2 text-sm text-red-600">{error}</p>
	{/if}
</div>