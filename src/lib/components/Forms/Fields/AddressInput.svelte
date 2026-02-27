<!-- AddressInput.svelte
     Address autocomplete field powered by Mapy.cz suggest API.
     Maps to FormFieldType 'address'.

     When the user picks a suggestion the component fills:
       - its own field  (street + house number)
       - field.addressSiblings.city        → city name
       - field.addressSiblings.postalCode  → postal / ZIP code
       - field.addressSiblings.country     → ISO 3166-1 alpha-2 code  (e.g. "CZ")

     The sibling onChange calls go through the same onChange callback so
     UniversalForm picks them up automatically — no extra wiring needed.
-->
<script lang="ts">
	import { MapPin } from 'lucide-svelte';
	import type { FormField } from '$lib/types/entities/forms';
	import { onMount } from 'svelte';
	import FormValidationIndicator from '$lib/components/Forms/FormValidationIndicator.svelte';
	import {
		fetchAddressSuggestions,
		type AddressSuggestion,
	} from '$lib/utils/mapyAddress';

	// ── Props ─────────────────────────────────────────────────────────────────
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
		onChange,
	}: Props = $props();

	// ── Sibling field names ───────────────────────────────────────────────────
	// Defined via field.addressSiblings in the form schema.
	const siblings = $derived(field.addressSiblings ?? {});

	// ── Internal state ────────────────────────────────────────────────────────
	let inputRef: HTMLInputElement;
	let dropdownRef: HTMLDivElement;
	let portalContainer: HTMLDivElement;

	let isFocused = $state(false);
	let showDropdown = $state(false);
	let suggestions = $state<AddressSuggestion[]>([]);
	let isLoading = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Track whether value changed from its initial to show the "modified" border
	let originalValue = $state(value);
	let previousValue = $state(value);

	$effect(() => {
		if (value !== previousValue) {
			if (!isFocused && !showDropdown) originalValue = value;
			previousValue = value;
		}
	});

	const hasChanged = $derived(value !== originalValue);

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
	let dropdownPosition = $state({ top: 0, left: 0, width: 320 });

	function updateDropdownPosition() {
		if (!inputRef) return;
		const rect = inputRef.getBoundingClientRect();
		dropdownPosition = {
			top: rect.bottom + 4,
			left: rect.left,
			width: Math.max(rect.width, 320),
		};
		// Clamp to viewport
		const maxLeft = window.innerWidth - dropdownPosition.width - 16;
		if (dropdownPosition.left > maxLeft) dropdownPosition.left = maxLeft;
		if (dropdownPosition.left < 16) dropdownPosition.left = 16;
	}

	// ── Handlers ──────────────────────────────────────────────────────────────
	function handleInput(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		onChange(field.name, target.value);

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
		// Fill own field (street)
		onChange(field.name, suggestion.street);

		// Fill sibling fields through the same onChange — UniversalForm handles it
		if (siblings.city) onChange(siblings.city, suggestion.city);
		if (siblings.postalCode) onChange(siblings.postalCode, suggestion.postalCode);
		if (siblings.country && suggestion.countryCode)
			onChange(siblings.country, suggestion.countryCode);

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

	// ── Border gradient (matches other inputs in the design system) ───────────
	const borderGradient = $derived.by(() => {
		if (showError) return 'from-red-400 to-red-500';
		if (isFocused || showDropdown) return 'from-indigo-500 via-purple-500 to-pink-500';
		if (value && !error && hasChanged) return 'from-emerald-400 to-teal-500';
		return '';
	});
</script>

<!-- ── Input ───────────────────────────────────────────────────────────────── -->
<div class="relative">
	<div
		class="relative rounded-xl p-[2px] transition-all duration-200
		       {borderGradient ? `bg-gradient-to-r ${borderGradient}` : 'bg-slate-300'}"
	>
		<!-- Icon + input row -->
		<div class="relative">
			<MapPin
				class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4
				       pointer-events-none z-10
				       {isFocused || showDropdown ? 'text-indigo-500' : 'text-slate-400'}"
			/>

			<input
				bind:this={inputRef}
				type="text"
				name={field.name}
				{value}
				oninput={handleInput}
				onfocus={() => (isFocused = true)}
				onblur={() => (isFocused = false)}
				placeholder={field.placeholder ?? 'Start typing an address…'}
				{disabled}
				maxlength={field.maxLength}
				autocomplete="off"
				spellcheck="false"
				class="w-full pl-10 pr-10 py-3 bg-white rounded-[11px]
				       text-sm text-slate-900 placeholder:text-slate-400
				       focus:outline-none transition-colors duration-150
				       {disabled ? 'cursor-not-allowed opacity-60' : ''}
				       {showError ? 'bg-red-50/50' : ''}"
			/>

			<!-- Loading spinner (visible while fetching) -->
			{#if isLoading}
				<div class="absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none">
					<div
						class="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent
						       rounded-full animate-spin"
					></div>
				</div>
			{/if}

			<!-- Validation dot -->
			<div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
				<FormValidationIndicator
					hasValue={!!value}
					hasError={!!error}
					{showError}
					isTouched={hasChanged}
					variant="default"
				/>
			</div>
		</div>
	</div>
</div>

<!-- ── Suggestions dropdown (portal) ─────────────────────────────────────── -->
{#if showDropdown && suggestions.length > 0 && !disabled}
	<div
		bind:this={dropdownRef}
		role="listbox"
		aria-label="Address suggestions"
		class="bg-white border border-slate-200 rounded-xl
		       shadow-2xl shadow-indigo-100/50
		       overflow-hidden animate-slide-down"
		style="position:fixed;
		       top:{dropdownPosition.top}px;
		       left:{dropdownPosition.left}px;
		       width:{dropdownPosition.width}px;
		       pointer-events:auto;"
	>
		<!-- Suggestion rows -->
		<div class="py-1">
			{#each suggestions as suggestion (suggestion.street + suggestion.postalCode)}
				<button
					type="button"
					role="option"
					aria-selected="false"
					onclick={() => handleSelect(suggestion)}
					class="w-full px-4 py-2.5 text-left flex items-start gap-3
					       hover:bg-indigo-50 transition-colors duration-100"
				>
					<MapPin class="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
					<div class="flex-1 min-w-0">
						<!-- Primary: street + number -->
						<div class="text-sm font-medium text-slate-900 truncate">
							{suggestion.label}
						</div>
						<!-- Secondary: city context -->
						<div class="text-xs text-slate-500 truncate">{suggestion.location}</div>
					</div>
					<!-- Postal code badge -->
					{#if suggestion.postalCode}
						<span
							class="text-xs font-mono text-slate-400 flex-shrink-0
							       bg-slate-100 px-1.5 py-0.5 rounded mt-0.5"
						>
							{suggestion.postalCode}
						</span>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Mapy.cz branding (required by their API ToS) -->
		<div
			class="px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100
			       border-t border-slate-200 flex items-center justify-end gap-1.5"
		>
			<span class="text-xs text-slate-400">Powered by</span>
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
