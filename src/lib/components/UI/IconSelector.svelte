<!-- src/lib/components/ui/IconSelector.svelte -->
<script lang="ts">
	import { Search, ChevronDown } from 'lucide-svelte';
	import { availableIcons, getIconComponent, getIconDisplayName, searchIcons } from '$lib/types/params/iconRegistry';
	import DynamicIcon from './DynamicIcon.svelte';
	import type { IconData } from '$lib/types/params/iconRegistry';

	interface Props {
		selectedIcon: string | null | undefined;
		onselect: (iconName: string) => void;
		label?: string;
		placeholder?: string;
		previewColor?: string;
		class?: string;
		disabled?: boolean;
		required?: boolean;
	}

	let {
		selectedIcon,
		onselect,
		label = 'Select Icon',
		placeholder = 'Choose an icon...',
		previewColor = '#3B82F6',
		class: className = '',
		disabled = false,
		required = false
	}: Props = $props();

	// Component state
	let showIconSelector = $state(false);
	let iconSearchQuery = $state('');
	let dropdownRef: HTMLDivElement;

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

	// Handle icon selection
	function handleIconSelect(iconName: string) {
		onselect(iconName);
		showIconSelector = false;
		iconSearchQuery = '';
	}

	// Handle click outside to close dropdown
	function handleClickOutside(event: MouseEvent) {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			showIconSelector = false;
			iconSearchQuery = '';
		}
	}

	// Close dropdown on escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			showIconSelector = false;
			iconSearchQuery = '';
		}
	}

	// Lifecycle
	$effect(() => {
		if (showIconSelector) {
			document.addEventListener('click', handleClickOutside);
			document.addEventListener('keydown', handleKeydown);

			return () => {
				document.removeEventListener('click', handleClickOutside);
				document.removeEventListener('keydown', handleKeydown);
			};
		}
	});
</script>

<div class={`relative ${className}`}>
	<!-- Label -->
	{#if label}
		<label class="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
			{#if currentIconComponent}
				<DynamicIcon iconName={selectedIcon} size={20} />
			{/if}
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<!-- Selector Button -->
	<div class="relative" bind:this={dropdownRef}>
		<button
			type="button"
			onclick={() => !disabled && (showIconSelector = !showIconSelector)}
			class="w-full flex items-center gap-3 px-3 py-2.5 text-sm border rounded-lg transition-colors bg-white text-left {disabled ? 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50' : 'border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'}"
			{disabled}
		>
			{#if selectedIcon}
				<div class="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style="background-color: {previewColor}">
					<DynamicIcon iconName={selectedIcon} class="text-white" size={20} />
				</div>
				<span class="flex-1 truncate">
					{getIconDisplayName(selectedIcon)}
				</span>
			{:else}
				<div class="w-8 h-8 rounded-md bg-slate-200 flex items-center justify-center flex-shrink-0">
					<Search class="w-4 h-4 text-slate-400" />
				</div>
				<span class="flex-1 text-slate-500">
					{placeholder}
				</span>
			{/if}

			<ChevronDown class="w-4 h-4 text-slate-400 flex-shrink-0 transition-transform {showIconSelector ? 'rotate-180' : ''}" />
		</button>

		<!-- Icon Dropdown -->
		{#if showIconSelector && !disabled}
			<div class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
				<!-- Search -->
				<div class="p-3 border-b border-slate-100">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<input
							type="text"
							bind:value={iconSearchQuery}
							placeholder="Search icons..."
							class="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
							autocomplete="off"
						/>
					</div>
				</div>

				<!-- Icons Grid -->
				<div class="p-2 max-h-64 overflow-y-auto">
					{#if filteredIcons.length > 0}
						<div class="grid grid-cols-4 gap-1">
							{#each filteredIcons as icon (icon.name)}
								{@const IconComp = icon.component}
								<button
									type="button"
									onclick={() => handleIconSelect(icon.name)}
									class="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-slate-100 transition-colors group {selectedIcon === icon.name ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-800'}"
									title={`${icon.displayName} (${icon.category})`}
								>
									<div class="w-6 h-6 flex items-center justify-center">
										<IconComp class="w-5 h-5" />
									</div>
									<span class="text-xs truncate max-w-full leading-tight">
										{icon.displayName}
									</span>
								</button>
							{/each}
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center py-8 text-slate-500">
							<Search class="w-8 h-8 mb-2 text-slate-300" />
							<p class="text-sm font-medium">No icons found</p>
							<p class="text-xs">Try adjusting your search terms</p>
						</div>
					{/if}
				</div>

				<!-- Footer with count -->
				<div class="px-3 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
					{filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} available
				</div>
			</div>
		{/if}
	</div>
</div>