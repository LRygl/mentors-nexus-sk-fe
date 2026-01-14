<!-- TEMPORARY DEBUG VERSION - Replace your TagInput.svelte with this -->
<!-- src/lib/components/Forms/Fields/TagInput.svelte -->
<script lang="ts">
	import { X, Plus, Tag } from 'lucide-svelte';
	import type { FormField } from '$lib/types/entities/forms';

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

	// Local state for the input field
	let inputValue = $state('');
	let isFocused = $state(false);
	let inputRef: HTMLInputElement;

	// Ensure currentTags is always an array
	let currentTags = $derived(Array.isArray(value) ? value : []);

	// Get configuration from field props
	let placeholder = $derived(field.placeholder || 'Type a tag and press Enter...');
	let maxTags = $derived(field.maxTags);
	let minTags = $derived(field.minTags);
	let allowDuplicates = $derived(field.allowDuplicates ?? false);

	// Check if we've reached the max tags limit
	let isAtMaxTags = $derived(maxTags !== undefined && currentTags.length >= maxTags);

	// Border styling based on state
	const borderClass = $derived(() => {
		if (disabled) return 'border-slate-300';
		if (showError) return 'border-red-400 ring-2 ring-red-100';
		if (isFocused) return 'border-indigo-500 ring-2 ring-indigo-200';
		if (currentTags.length > 0) return 'border-emerald-400';
		return 'border-slate-200';
	});

	// Background styling
	const bgClass = $derived(() => {
		if (disabled) return 'bg-slate-50';
		if (showError) return 'bg-red-50/30';
		return 'bg-white';
	});

	// Add a new tag
	function addTag(tag: string) {
		console.log('🏷️ addTag called with:', tag); // DEBUG

		if (disabled || isAtMaxTags) {
			console.log('🚫 Blocked: disabled or at max tags'); // DEBUG
			return;
		}

		const trimmedTag = tag.trim();

		// Don't add empty tags
		if (!trimmedTag) {
			console.log('🚫 Blocked: empty tag'); // DEBUG
			inputValue = '';
			return;
		}

		// Check for duplicates if not allowed
		if (!allowDuplicates && currentTags.includes(trimmedTag)) {
			console.log('🚫 Blocked: duplicate tag'); // DEBUG
			inputValue = '';
			return;
		}

		const newTags = [...currentTags, trimmedTag];
		console.log('✅ Adding tag. New tags array:', newTags); // DEBUG
		console.log('🔄 Calling onChange with:', field.name, newTags); // DEBUG

		// Call onChange with new tags array
		onChange(field.name, newTags);
		inputValue = '';
	}

	// Remove a tag by index
	function removeTag(indexToRemove: number) {
		console.log('🗑️ removeTag called for index:', indexToRemove); // DEBUG

		if (disabled) return;
		const newTags = currentTags.filter((_, index) => index !== indexToRemove);
		console.log('🔄 Calling onChange with:', field.name, newTags); // DEBUG
		onChange(field.name, newTags);
	}

	// Handle keyboard events
	function handleKeyDown(event: KeyboardEvent) {
		console.log('⌨️ Key pressed:', event.key); // DEBUG

		if (event.key === 'Enter') {
			event.preventDefault();
			console.log('⏎ Enter pressed, adding tag:', inputValue); // DEBUG
			addTag(inputValue);
		} else if (event.key === 'Backspace' && !inputValue && currentTags.length > 0) {
			console.log('⌫ Backspace on empty input, removing last tag'); // DEBUG
			removeTag(currentTags.length - 1);
		}
	}

	// Focus the input when clicking on the container
	function focusInput() {
		if (!disabled && inputRef) {
			inputRef.focus();
		}
	}
</script>

<div class="relative">
	<!-- Main Container -->
	<div
		onclick={focusInput}
		class="min-h-[100px] p-3 border-2 rounded-lg transition-all duration-200 cursor-text {borderClass()} {bgClass()} {disabled ? 'cursor-not-allowed opacity-60' : ''}"
	>
		<!-- Tags Display Area -->
		<div class="flex flex-wrap gap-2 mb-2">
			{#each currentTags as tag, index (index)}
				<div
					class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all animate-scale-in group"
				>
					<span>{tag}</span>
					<button
						type="button"
						onclick={(e) => {
							e.stopPropagation();
							removeTag(index);
						}}
						disabled={disabled}
						class="p-0.5 hover:bg-white/20 rounded-full transition-colors disabled:cursor-not-allowed"
						aria-label="Remove {tag}"
					>
						<X class="w-3.5 h-3.5" />
					</button>
				</div>
			{/each}
		</div>

		<!-- Input Field -->
		<input
			bind:this={inputRef}
			type="text"
			bind:value={inputValue}
			onkeydown={handleKeyDown}
			onfocus={() => (isFocused = true)}
			onblur={() => (isFocused = false)}
			placeholder={currentTags.length === 0 ? placeholder : 'Add another tag...'}
			disabled={disabled || isAtMaxTags}
			class="w-full outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent disabled:cursor-not-allowed"
		/>

		<!-- Add Button (shows when typing) -->
		{#if inputValue.trim() && !disabled && !isAtMaxTags}
			<button
				type="button"
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					console.log('➕ Plus button clicked'); // DEBUG
					addTag(inputValue);
				}}
				class="absolute right-2 top-2 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-sm animate-scale-in"
			>
				<Plus class="w-4 h-4" />
			</button>
		{/if}
	</div>

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
			{#if currentTags.length > 0}
				<span class="text-slate-500 font-medium">
					{currentTags.length} tag{currentTags.length !== 1 ? 's' : ''} added
				</span>
			{/if}

			{#if minTags && currentTags.length < minTags}
				<span class="text-amber-600 font-medium">
					Minimum {minTags} required
				</span>
			{/if}
		</div>

		{#if maxTags}
			<span class="text-slate-400">
				{#if isAtMaxTags}
					<span class="text-amber-600 font-medium">Maximum reached</span>
				{:else}
					Max: {maxTags}
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

    @keyframes shake {
        0%,
        100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-4px);
        }
        75% {
            transform: translateX(4px);
        }
    }

    .animate-scale-in {
        animation: scale-in 0.2s ease-out;
    }

    .animate-shake {
        animation: shake 0.3s ease-out;
    }
</style>