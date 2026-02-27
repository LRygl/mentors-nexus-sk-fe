<!-- CountryInput.svelte
     A styled country selector that shows a flag emoji next to the country name.
     Renders a portal dropdown with search, matching the SelectInput portal pattern.
     Maps to FormFieldType 'country'.
     field.options must be FieldOption[] where value = ISO 3166-1 alpha-2 code (e.g. 'CZ').
-->
<script lang="ts">
	import { ChevronDown, Search, Check, Globe } from 'lucide-svelte';
	import type { FormField, FieldOption } from '$lib/types/entities/forms';
	import { onMount } from 'svelte';
	import FormValidationIndicator from '$lib/components/Forms/FormValidationIndicator.svelte';

	// ── Helpers ───────────────────────────────────────────────────────────────

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

	// ── Derived option list ───────────────────────────────────────────────────
	const options: FieldOption[] = $derived(field.options ?? []);

	const selectedOption = $derived(
		options.find((o) => o.value === value) ?? null
	);

	// ── Internal state ────────────────────────────────────────────────────────
	let originalValue = $state(value);
	let previousValue = $state(value);

	let isFocused    = $state(false);
	let showDropdown = $state(false);
	let searchQuery  = $state('');

	// Re-sync when value is reset externally (form discard)
	$effect(() => {
		if (value !== previousValue) {
			if (!isFocused && !showDropdown) {
				originalValue = value;
			}
			previousValue = value;
		}
	});

	const hasChanged = $derived(value !== originalValue);

	// ── Filtered options ──────────────────────────────────────────────────────
	const filteredOptions = $derived.by(() => {
		if (!searchQuery) return options;
		const q = searchQuery.toLowerCase();
		return options.filter(
			(o) =>
				o.label.toLowerCase().includes(q) ||
				String(o.value).toLowerCase().includes(q)
		);
	});

	// ── Handlers ──────────────────────────────────────────────────────────────
	function handleSelect(opt: FieldOption) {
		onChange(field.name, opt.value);
		showDropdown = false;
		searchQuery  = '';
	}

	function handleClear(e: MouseEvent) {
		e.stopPropagation();
		onChange(field.name, '');
	}

	// ── Portal dropdown ───────────────────────────────────────────────────────
	let triggerRef: HTMLButtonElement;
	let dropdownRef: HTMLDivElement;
	let portalContainer: HTMLDivElement;
	let dropdownPosition = $state({ top: 0, left: 0, width: 240 });

	onMount(() => {
		portalContainer = document.createElement('div');
		portalContainer.style.cssText =
			'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 99999;';
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

	function toggleDropdown() {
		if (disabled) return;
		showDropdown = !showDropdown;
		if (showDropdown) {
			searchQuery = '';
			setTimeout(() => updateDropdownPosition(), 0);
		}
	}

	function updateDropdownPosition() {
		if (!triggerRef) return;
		const rect          = triggerRef.getBoundingClientRect();
		const maxHeight     = 320;
		const viewportHeight = window.innerHeight;
		const spaceBelow    = viewportHeight - rect.bottom;
		const spaceAbove    = rect.top;
		const openUpward    = spaceBelow < maxHeight && spaceAbove > spaceBelow;
		const dropWidth     = Math.max(rect.width, 240);

		dropdownPosition = openUpward
			? { top: rect.top - Math.min(maxHeight, spaceAbove - 16) - 4, left: rect.left, width: dropWidth }
			: { top: rect.bottom + 4, left: rect.left, width: dropWidth };

		const maxLeft = window.innerWidth - dropdownPosition.width - 16;
		if (dropdownPosition.left > maxLeft) dropdownPosition.left = maxLeft;
		if (dropdownPosition.left < 16)      dropdownPosition.left = 16;
	}

	function handleClickOutside(event: MouseEvent) {
		if (!showDropdown) return;
		const target = event.target as Node;
		if (!triggerRef?.contains(target) && !dropdownRef?.contains(target)) {
			showDropdown = false;
			searchQuery  = '';
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

	// ── Visual state ──────────────────────────────────────────────────────────
	const borderGradient = $derived.by(() => {
		if (showError)                          return 'from-red-400 to-red-500';
		if (isFocused || showDropdown)          return 'from-indigo-500 via-purple-500 to-pink-500';
		if (value && !error && hasChanged)      return 'from-emerald-400 to-teal-500';
		return '';
	});
</script>

<div class="relative">
	<!-- Gradient border wrapper -->
	<div
		class="relative rounded-xl p-[2px] transition-all duration-200
		       {borderGradient ? `bg-gradient-to-r ${borderGradient}` : 'bg-slate-300'}"
	>
		<!-- Trigger button -->
		<button
			bind:this={triggerRef}
			type="button"
			onclick={toggleDropdown}
			onfocus={() => (isFocused = true)}
			onblur={() => (isFocused = false)}
			{disabled}
			aria-haspopup="listbox"
			aria-expanded={showDropdown}
			class="w-full flex items-center gap-2.5 pl-3.5 pr-10 py-3 bg-white rounded-[11px]
			       text-left text-sm transition-colors duration-150
			       {disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-slate-50/80'}
			       {showError ? 'bg-red-50/50' : ''}"
		>
			{#if selectedOption && selectedOption.value}
				<!-- Flat flag + label -->
				<span class="fi fi-{String(selectedOption.value).toLowerCase()} flag-sm"></span>
				<span class="flex-1 truncate text-slate-900">{selectedOption.label}</span>
			{:else}
				<!-- Placeholder (no selection, or empty-value sentinel option selected) -->
				<Globe class="w-4 h-4 text-slate-400 flex-shrink-0" />
				<span class="flex-1 truncate text-slate-400">
					{field.placeholder ?? 'Select country…'}
				</span>
			{/if}

			<!-- Chevron -->
			<ChevronDown
				class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400
				       transition-transform duration-200
				       {showDropdown ? 'rotate-180 text-indigo-600' : ''}"
			/>
		</button>

		<!-- Validation indicator — right side, inside the wrapper -->
		<div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
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

<!-- ── Dropdown (portal) ──────────────────────────────────────────────────── -->
{#if showDropdown && !disabled}
	<div
		bind:this={dropdownRef}
		role="listbox"
		aria-label="Select country"
		class="bg-white border border-slate-200 rounded-xl shadow-2xl shadow-indigo-100/50
		       overflow-hidden animate-slide-down"
		style="position: fixed;
		       top: {dropdownPosition.top}px;
		       left: {dropdownPosition.left}px;
		       width: {dropdownPosition.width}px;
		       pointer-events: auto;"
	>
		<!-- Search bar -->
		<div class="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
			<div class="relative">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search country…"
					class="w-full pl-9 pr-3 py-2 text-sm border border-indigo-200 rounded-lg
					       bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					onclick={(e) => e.stopPropagation()}
				/>
			</div>
		</div>

		<!-- Option list -->
		<div class="max-h-64 overflow-y-auto custom-scrollbar">
			{#if filteredOptions.length > 0}
				<div class="py-1">
					{#each filteredOptions as opt (opt.value)}
						<button
							type="button"
							role="option"
							aria-selected={opt.value === value}
							onclick={() => handleSelect(opt)}
							disabled={opt.disabled}
							class="w-full px-3 py-2.5 text-left flex items-center gap-3
							       transition-colors duration-100
							       {opt.disabled ? 'opacity-50 cursor-not-allowed' : ''}
							       {opt.value === value
							           ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900'
							           : 'hover:bg-slate-50 text-slate-700'}"
						>
							<!-- Flat flag (only for non-empty values) -->
							{#if opt.value}
								<span class="fi fi-{String(opt.value).toLowerCase()} flag-sm"></span>
							{:else}
								<Globe class="w-4 h-4 text-slate-400 flex-shrink-0" />
							{/if}

							<!-- Country name -->
							<span class="flex-1 text-sm truncate">{opt.label}</span>

							<!-- ISO code hint -->
							{#if opt.value}
								<span class="text-xs font-mono text-slate-400 flex-shrink-0">
									{opt.value}
								</span>
							{/if}

							<!-- Selected check -->
							{#if opt.value === value}
								<Check class="w-4 h-4 text-indigo-600 flex-shrink-0" />
							{/if}
						</button>
					{/each}
				</div>
			{:else}
				<div class="px-4 py-8 text-center">
					<Search class="w-8 h-8 mx-auto mb-2 text-slate-300" />
					<p class="text-sm text-slate-500">No countries found</p>
				</div>
			{/if}
		</div>

		<!-- Footer -->
		<div class="px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 text-xs text-slate-500">
			{filteredOptions.length} {filteredOptions.length === 1 ? 'country' : 'countries'}
		</div>
	</div>
{/if}

<style>
	/* Flat flag size — same as PhoneInput */
	:global(.flag-sm) {
		width: 22px;
		height: 16px;
		border-radius: 2px;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
		flex-shrink: 0;
	}

	@keyframes slide-down {
		from { opacity: 0; transform: translateY(-6px); }
		to   { opacity: 1; transform: translateY(0);    }
	}
	.animate-slide-down { animation: slide-down 0.15s ease-out; }

	.custom-scrollbar::-webkit-scrollbar       { width: 6px; }
	.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
	.custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #818cf8, #a78bfa); border-radius: 3px; }
	.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #6366f1, #9333ea); }
</style>
