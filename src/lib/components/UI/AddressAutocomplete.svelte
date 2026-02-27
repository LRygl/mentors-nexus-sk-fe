<!-- AddressAutocomplete.svelte
     Standalone address autocomplete widget powered by Mapy.cz.
     Use this on pages that manage their own form state directly
     (e.g. the checkout page) rather than through UniversalForm.

     Usage:
       <AddressAutocomplete
         bind:value={form.street}
         onAddressSelect={(addr) => {
           form.street     = addr.street;
           form.city       = addr.city;
           form.postalCode = addr.postalCode;
           form.country    = addr.countryCode;
         }}
         id="street"
         required
         placeholder="123 Main Street"
       />
-->
<script lang="ts">
	import { MapPin } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import {
		fetchAddressSuggestions,
		type AddressSuggestion,
	} from '$lib/utils/mapyAddress';

	// ── Props ─────────────────────────────────────────────────────────────────
	interface AddressSelectPayload {
		street: string;
		city: string;
		postalCode: string;
		countryCode: string;
	}

	interface Props {
		/** Two-way bound to the street input value */
		value: string;
		/** Called when the user picks a suggestion — fill sibling fields here */
		onAddressSelect?: (address: AddressSelectPayload) => void;
		id?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		/** Extra Tailwind classes for the <input> element */
		inputClass?: string;
	}

	let {
		value = $bindable(),
		onAddressSelect,
		id,
		placeholder = '123 Main Street',
		required = false,
		disabled = false,
		inputClass = '',
	}: Props = $props();

	// ── Internal state ────────────────────────────────────────────────────────
	let inputRef: HTMLInputElement;
	let dropdownRef: HTMLDivElement;
	let portalContainer: HTMLDivElement;

	let showDropdown = $state(false);
	let suggestions = $state<AddressSuggestion[]>([]);
	let isLoading = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout>;
	let dropdownPosition = $state({ top: 0, left: 0, width: 320 });

	// ── Portal setup ──────────────────────────────────────────────────────────
	onMount(() => {
		portalContainer = document.createElement('div');
		portalContainer.style.cssText =
			'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
		document.body.appendChild(portalContainer);
		return () => {
			if (portalContainer?.parentNode) portalContainer.parentNode.removeChild(portalContainer);
		};
	});

	$effect(() => {
		if (showDropdown && dropdownRef && portalContainer) {
			portalContainer.appendChild(dropdownRef);
		}
	});

	// ── Dropdown positioning ──────────────────────────────────────────────────
	function updateDropdownPosition() {
		if (!inputRef) return;
		const rect = inputRef.getBoundingClientRect();
		dropdownPosition = {
			top: rect.bottom + 4,
			left: rect.left,
			width: Math.max(rect.width, 320),
		};
		const maxLeft = window.innerWidth - dropdownPosition.width - 16;
		if (dropdownPosition.left > maxLeft) dropdownPosition.left = maxLeft;
		if (dropdownPosition.left < 16) dropdownPosition.left = 16;
	}

	// ── Handlers ──────────────────────────────────────────────────────────────
	function handleInput(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		value = target.value;

		clearTimeout(debounceTimer);
		if (target.value.trim().length < 3) {
			suggestions = [];
			showDropdown = false;
			return;
		}

		debounceTimer = setTimeout(async () => {
			isLoading = true;
			try {
				const results = await fetchAddressSuggestions(target.value);
				suggestions = results;
				if (results.length > 0) {
					updateDropdownPosition();
					showDropdown = true;
				} else {
					showDropdown = false;
				}
			} finally {
				isLoading = false;
			}
		}, 300);
	}

	function handleSelect(suggestion: AddressSuggestion) {
		value = suggestion.street;
		onAddressSelect?.({
			street: suggestion.street,
			city: suggestion.city,
			postalCode: suggestion.postalCode,
			countryCode: suggestion.countryCode,
		});
		showDropdown = false;
		suggestions = [];
		clearTimeout(debounceTimer);
	}

	function handleClickOutside(event: MouseEvent) {
		if (!showDropdown) return;
		const target = event.target as Node;
		if (!inputRef?.contains(target) && !dropdownRef?.contains(target)) {
			showDropdown = false;
		}
	}

	$effect(() => {
		if (showDropdown) {
			document.addEventListener('click', handleClickOutside, true);
			window.addEventListener('scroll', updateDropdownPosition, true);
			window.addEventListener('resize', updateDropdownPosition);
			return () => {
				document.removeEventListener('click', handleClickOutside, true);
				window.removeEventListener('scroll', updateDropdownPosition, true);
				window.removeEventListener('resize', updateDropdownPosition);
			};
		}
	});
</script>

<!-- ── Input ───────────────────────────────────────────────────────────────── -->
<div class="relative">
	<input
		bind:this={inputRef}
		type="text"
		{id}
		{value}
		oninput={handleInput}
		{required}
		{disabled}
		{placeholder}
		autocomplete="off"
		spellcheck="false"
		class={inputClass}
	/>
	{#if isLoading}
		<div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
			<div
				class="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent
				       rounded-full animate-spin"
			></div>
		</div>
	{/if}
</div>

<!-- ── Suggestions dropdown (portal) ─────────────────────────────────────── -->
{#if showDropdown && suggestions.length > 0 && !disabled}
	<div
		bind:this={dropdownRef}
		role="listbox"
		aria-label="Address suggestions"
		class="bg-white border border-gray-200 rounded-xl
		       shadow-xl shadow-gray-200/60
		       overflow-hidden animate-slide-down"
		style="position:fixed;
		       top:{dropdownPosition.top}px;
		       left:{dropdownPosition.left}px;
		       width:{dropdownPosition.width}px;
		       pointer-events:auto;"
	>
		<div class="py-1">
			{#each suggestions as suggestion (suggestion.street + suggestion.postalCode)}
				<button
					type="button"
					role="option"
					aria-selected="false"
					onclick={() => handleSelect(suggestion)}
					class="w-full px-4 py-2.5 text-left flex items-start gap-3
					       hover:bg-blue-50 transition-colors duration-100 group"
				>
					<MapPin
						class="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5
						       group-hover:text-blue-600"
					/>
					<div class="flex-1 min-w-0">
						<div class="text-sm font-medium text-gray-900 truncate">
							{suggestion.label}
						</div>
						<div class="text-xs text-gray-500 truncate">{suggestion.location}</div>
					</div>
					{#if suggestion.postalCode}
						<span
							class="text-xs font-mono text-gray-400 flex-shrink-0
							       bg-gray-100 px-1.5 py-0.5 rounded mt-0.5"
						>
							{suggestion.postalCode}
						</span>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Mapy.cz branding (required by their API ToS) -->
		<div
			class="px-4 py-2 bg-gray-50 border-t border-gray-100
			       flex items-center justify-end gap-1.5"
		>
			<span class="text-xs text-gray-400">Powered by</span>
			<img
				src="https://api.mapy.cz/img/api/logo-small.svg"
				alt="Mapy.cz"
				class="h-4 w-auto"
				loading="lazy"
			/>
		</div>
	</div>
{/if}

<style>
	@keyframes slide-down {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-slide-down {
		animation: slide-down 0.15s ease-out;
	}
</style>
