<!--
  StringListInput.svelte - Fixed Version

  This component receives props via the standard FormFieldRenderer pattern:
  - field: FormField object containing all configuration
  - value: current array value
  - error: validation error message
  - showError: whether to display error
  - disabled: whether field is disabled
  - onChange: callback function

  The key fix: Extract minItems/maxItems from field.minItems and field.maxItems
-->

<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { FormField } from '$lib/types/entities/forms';

	// Props matching FormFieldRenderer pattern
	interface Props {
		field: FormField;
		value: string[];
		error?: string;
		showError?: boolean;
		disabled?: boolean;
		onChange: (fieldName: string, value: string[]) => void;
	}

	let {
		field,
		value = $bindable([]),
		error = '',
		showError = false,
		disabled = false,
		onChange
	}: Props = $props();

	// Extract configuration from field object
	const minItems = $derived(field.minItems ?? 0);
	const maxItems = $derived(field.maxItems ?? 20);
	const maxItemLength = $derived(field.maxItemLength ?? 500);
	const numbered = $derived(field.numbered ?? true);
	const addButtonText = $derived(field.addButtonText ?? 'Add');
	const placeholder = $derived(field.placeholder ?? 'Add new item...');

	// Local state
	let inputValue = $state('');
	let inputRef: HTMLInputElement | null = $state(null);
	let isInputFocused = $state(false);
	let recentlyAdded = $state<number | null>(null);
	let draggedIndex = $state<number | null>(null);
	let dragOverIndex = $state<number | null>(null);

	// Computed
	const canAddMore = $derived(value.length < maxItems && !disabled);
	const isAtLimit = $derived(value.length >= maxItems);
	const meetsMinimum = $derived(value.length >= minItems);
	const progress = $derived(maxItems > 0 ? Math.min((value.length / maxItems) * 100, 100) : 0);

	// Size config
	const cfg = {
		input: 'px-4 py-2.5 text-sm',
		button: 'px-4 py-2.5 text-sm',
		item: 'p-3 text-sm',
		icon: 'w-5 h-5'
	};

	function addItem() {
		const trimmed = inputValue.trim();
		if (!trimmed || !canAddMore || trimmed.length > maxItemLength) return;

		const newValue = [...value, trimmed];
		value = newValue;
		inputValue = '';
		recentlyAdded = newValue.length - 1;

		setTimeout(() => recentlyAdded = null, 600);
		onChange(field.name, newValue);
		inputRef?.focus();
	}

	function removeItem(index: number) {
		if (disabled) return;
		const newValue = value.filter((_, i) => i !== index);
		value = newValue;
		onChange(field.name, newValue);
	}

	function moveUp(index: number) {
		if (index === 0 || disabled) return;
		const newValue = [...value];
		[newValue[index - 1], newValue[index]] = [newValue[index], newValue[index - 1]];
		value = newValue;
		onChange(field.name, newValue);
	}

	function moveDown(index: number) {
		if (index === value.length - 1 || disabled) return;
		const newValue = [...value];
		[newValue[index], newValue[index + 1]] = [newValue[index + 1], newValue[index]];
		value = newValue;
		onChange(field.name, newValue);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addItem();
		}
	}

	// Drag and drop
	function handleDragStart(index: number) {
		if (disabled) return;
		draggedIndex = index;
	}

	function handleDragOver(event: DragEvent, index: number) {
		event.preventDefault();
		if (draggedIndex !== null && draggedIndex !== index) {
			dragOverIndex = index;
		}
	}

	function handleDrop(index: number) {
		if (draggedIndex === null || draggedIndex === index) return;

		const newValue = [...value];
		const [removed] = newValue.splice(draggedIndex, 1);
		newValue.splice(index, 0, removed);
		value = newValue;

		draggedIndex = null;
		dragOverIndex = null;
		onChange(field.name, newValue);
	}

	function handleDragEnd() {
		draggedIndex = null;
		dragOverIndex = null;
	}
</script>

<div
	class="string-list-input"
	class:disabled
	class:has-error={showError && !!error}
>
	<!-- Header: Counter with Limits (label handled by FormFieldRenderer) -->
	<div class="flex items-center justify-end mb-2">
		<!-- Progress indicator with limits display -->
		<div class="flex items-center gap-3">
			<!-- Min/Max badges -->
			<div class="flex items-center gap-1.5 text-xs">
				{#if minItems > 0}
					<span
						class="px-1.5 py-0.5 rounded font-medium transition-colors"
						class:bg-green-100={meetsMinimum}
						class:text-green-700={meetsMinimum}
						class:bg-amber-100={!meetsMinimum}
						class:text-amber-700={!meetsMinimum}
					>
						min: {minItems}
					</span>
				{/if}
				<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
					max: {maxItems}
				</span>
			</div>

			<!-- Counter -->
			<span
				class="text-sm font-semibold tabular-nums transition-colors"
				class:text-slate-600={!isAtLimit && meetsMinimum}
				class:text-amber-600={isAtLimit}
				class:text-red-600={!meetsMinimum && value.length > 0}
			>
				{value.length}/{maxItems}
			</span>

			<!-- Progress bar -->
			<div class="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
				<div
					class="h-full rounded-full transition-all duration-300 ease-out"
					class:bg-blue-500={progress < 80 && meetsMinimum}
					class:bg-amber-500={progress >= 80 && progress < 100}
					class:bg-red-500={progress >= 100 || (!meetsMinimum && value.length > 0)}
					style="width: {progress}%"
				></div>
			</div>
		</div>
	</div>

	<!-- Input Area -->
	<div class="input-wrapper relative">
		<div class="flex gap-2">
			<div class="relative flex-1">
				<input
					bind:this={inputRef}
					bind:value={inputValue}
					type="text"
					placeholder={placeholder}
					disabled={disabled || isAtLimit}
					maxlength={maxItemLength}
					onkeydown={handleKeydown}
					onfocus={() => isInputFocused = true}
					onblur={() => isInputFocused = false}
					class="
						w-full border rounded-xl bg-white transition-all duration-200
						{cfg.input}
						{showError && error
							? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
							: 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
						}
						focus:ring-4 focus:outline-none
						disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
						placeholder:text-slate-400
					"
				/>

				{#if inputValue.length > 0}
					<span
						class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none"
						transition:fade={{ duration: 150 }}
					>
						{inputValue.length}/{maxItemLength}
					</span>
				{/if}
			</div>

			<button
				type="button"
				onclick={addItem}
				disabled={!canAddMore || !inputValue.trim()}
				class="
					{cfg.button}
					inline-flex items-center gap-2 font-medium rounded-xl
					transition-all duration-200 ease-out
					disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
					bg-gradient-to-r from-blue-600 to-blue-700
					hover:from-blue-700 hover:to-blue-800
					active:scale-[0.98]
					text-white shadow-sm hover:shadow-md
					focus:outline-none focus:ring-4 focus:ring-blue-500/20
				"
			>
				<svg class="{cfg.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span class="hidden sm:inline">{addButtonText}</span>
			</button>
		</div>

		{#if isAtLimit}
			<p class="mt-1.5 text-xs text-amber-600 flex items-center gap-1" transition:fly={{ y: -5, duration: 150 }}>
				<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
				</svg>
				Maximum of {maxItems} items reached
			</p>
		{/if}
	</div>

	<!-- Items List -->
	<div class="mt-3">
		{#if value.length > 0}
			<ul class="space-y-2" role="list">
				{#each value as item, index (item + '-' + index)}
					<li
						draggable={!disabled}
						ondragstart={() => handleDragStart(index)}
						ondragover={(e) => handleDragOver(e, index)}
						ondrop={() => handleDrop(index)}
						ondragend={handleDragEnd}
						animate:flip={{ duration: 250, easing: cubicOut }}
						in:fly={{ y: -10, duration: 200, easing: cubicOut }}
						out:scale={{ duration: 150, start: 0.95 }}
						class="
							group relative flex items-center gap-3
							{cfg.item}
							bg-white border rounded-xl
							transition-all duration-200 ease-out
							{draggedIndex === index ? 'opacity-50 scale-[0.98]' : ''}
							{dragOverIndex === index ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200'}
							{recentlyAdded === index ? 'ring-2 ring-green-500/30 border-green-400' : ''}
							hover:border-slate-300 hover:shadow-sm
							cursor-grab active:cursor-grabbing
						"
					>
						<!-- Drag Handle -->
						<div class="drag-handle flex-shrink-0 text-slate-300 group-hover:text-slate-400 transition-colors">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-2 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8-14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-2 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm2 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
							</svg>
						</div>

						<!-- Number Badge -->
						{#if numbered}
							<span
								class="
									flex-shrink-0 w-6 h-6 flex items-center justify-center
									text-xs font-semibold rounded-lg
									bg-slate-100 text-slate-500
									group-hover:bg-blue-100 group-hover:text-blue-600
									transition-colors duration-200
								"
							>
								{index + 1}
							</span>
						{/if}

						<!-- Item Text -->
						<span class="flex-1 text-slate-700 break-words leading-relaxed">
							{item}
						</span>

						<!-- Actions -->
						<div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
							{#if index > 0}
								<button
									type="button"
									onclick={(e) => { e.stopPropagation(); moveUp(index); }}
									disabled={disabled}
									class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
									title="Move up"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
									</svg>
								</button>
							{/if}

							{#if index < value.length - 1}
								<button
									type="button"
									onclick={(e) => { e.stopPropagation(); moveDown(index); }}
									disabled={disabled}
									class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
									title="Move down"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
									</svg>
								</button>
							{/if}

							<button
								type="button"
								onclick={(e) => { e.stopPropagation(); removeItem(index); }}
								disabled={disabled}
								class="
									p-1.5 rounded-lg transition-colors
									text-slate-400 hover:text-red-600 hover:bg-red-50
									disabled:opacity-30 disabled:cursor-not-allowed
								"
								title="Remove item"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<!-- Empty State -->
			<div
				class="
					flex flex-col items-center justify-center py-8 px-4
					border-2 border-dashed rounded-xl
					{minItems > 0 ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200 bg-slate-50/50'}
				"
				transition:fade={{ duration: 200 }}
			>
				<div class="w-12 h-12 rounded-full flex items-center justify-center mb-3"
						 class:bg-amber-100={minItems > 0}
						 class:bg-slate-100={minItems === 0}
				>
					<svg
						class="w-6 h-6"
						class:text-amber-500={minItems > 0}
						class:text-slate-400={minItems === 0}
						fill="none" stroke="currentColor" viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
				</div>
				<p class="text-sm font-medium mb-1"
					 class:text-amber-700={minItems > 0}
					 class:text-slate-500={minItems === 0}
				>
					No items yet
				</p>
				{#if minItems > 0}
					<p class="text-xs text-amber-600">
						At least {minItems} {minItems === 1 ? 'item is' : 'items are'} required
					</p>
				{:else}
					<p class="text-xs text-slate-400">Type above and press Enter or click Add</p>
				{/if}
			</div>
		{/if}
	</div>

</div>

<style>
    .string-list-input {
        width: 100%;
    }

    .string-list-input.disabled {
        opacity: 0.6;
        pointer-events: none;
    }

    li[draggable="true"] {
        touch-action: none;
    }

    ul {
        max-height: 400px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #cbd5e1 transparent;
    }

    ul::-webkit-scrollbar {
        width: 6px;
    }

    ul::-webkit-scrollbar-track {
        background: transparent;
    }

    ul::-webkit-scrollbar-thumb {
        background-color: #cbd5e1;
        border-radius: 3px;
    }

    ul::-webkit-scrollbar-thumb:hover {
        background-color: #94a3b8;
    }
</style>