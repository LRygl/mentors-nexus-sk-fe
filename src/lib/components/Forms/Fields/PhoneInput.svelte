<!-- PhoneInput.svelte
     A split input showing a country-code picker (flag + dial code) on the left
     and a text field for the local number on the right.
     Emits combined value as "<dialCode> <localNumber>", e.g. "+420 123456789".
     Maps to FormFieldType 'tel'.
-->
<script lang="ts">
	import { ChevronDown, Search, Check } from 'lucide-svelte';
	import type { FormField } from '$lib/types/entities/forms';
	import { onMount } from 'svelte';
	import FormValidationIndicator from '$lib/components/Forms/FormValidationIndicator.svelte';

	// ── Country data ──────────────────────────────────────────────────────────
	interface PhoneCountry {
		code: string;   // ISO 3166-1 alpha-2
		name: string;
		dialCode: string; // e.g. "+420"
	}

	// Countries sorted: CZ + SK first (common for this app), then alphabetically
	const PHONE_COUNTRIES: PhoneCountry[] = [
		{ code: 'CZ', name: 'Czech Republic', dialCode: '+420' },
		{ code: 'SK', name: 'Slovakia',        dialCode: '+421' },
		{ code: 'AT', name: 'Austria',          dialCode: '+43'  },
		{ code: 'DE', name: 'Germany',          dialCode: '+49'  },
		{ code: 'PL', name: 'Poland',           dialCode: '+48'  },
		{ code: 'HU', name: 'Hungary',          dialCode: '+36'  },
		{ code: 'BE', name: 'Belgium',          dialCode: '+32'  },
		{ code: 'BG', name: 'Bulgaria',         dialCode: '+359' },
		{ code: 'HR', name: 'Croatia',          dialCode: '+385' },
		{ code: 'DK', name: 'Denmark',          dialCode: '+45'  },
		{ code: 'EE', name: 'Estonia',          dialCode: '+372' },
		{ code: 'FI', name: 'Finland',          dialCode: '+358' },
		{ code: 'FR', name: 'France',           dialCode: '+33'  },
		{ code: 'GR', name: 'Greece',           dialCode: '+30'  },
		{ code: 'IE', name: 'Ireland',          dialCode: '+353' },
		{ code: 'IT', name: 'Italy',            dialCode: '+39'  },
		{ code: 'LV', name: 'Latvia',           dialCode: '+371' },
		{ code: 'LT', name: 'Lithuania',        dialCode: '+370' },
		{ code: 'LU', name: 'Luxembourg',       dialCode: '+352' },
		{ code: 'NL', name: 'Netherlands',      dialCode: '+31'  },
		{ code: 'NO', name: 'Norway',           dialCode: '+47'  },
		{ code: 'PT', name: 'Portugal',         dialCode: '+351' },
		{ code: 'RO', name: 'Romania',          dialCode: '+40'  },
		{ code: 'RS', name: 'Serbia',           dialCode: '+381' },
		{ code: 'SI', name: 'Slovenia',         dialCode: '+386' },
		{ code: 'ES', name: 'Spain',            dialCode: '+34'  },
		{ code: 'SE', name: 'Sweden',           dialCode: '+46'  },
		{ code: 'CH', name: 'Switzerland',      dialCode: '+41'  },
		{ code: 'UA', name: 'Ukraine',          dialCode: '+380' },
		{ code: 'GB', name: 'United Kingdom',   dialCode: '+44'  },
		{ code: 'AU', name: 'Australia',        dialCode: '+61'  },
		{ code: 'BR', name: 'Brazil',           dialCode: '+55'  },
		{ code: 'CA', name: 'Canada',           dialCode: '+1'   },
		{ code: 'CN', name: 'China',            dialCode: '+86'  },
		{ code: 'IN', name: 'India',            dialCode: '+91'  },
		{ code: 'IL', name: 'Israel',           dialCode: '+972' },
		{ code: 'JP', name: 'Japan',            dialCode: '+81'  },
		{ code: 'MX', name: 'Mexico',           dialCode: '+52'  },
		{ code: 'RU', name: 'Russia',           dialCode: '+7'   },
		{ code: 'ZA', name: 'South Africa',     dialCode: '+27'  },
		{ code: 'TR', name: 'Turkey',           dialCode: '+90'  },
		{ code: 'US', name: 'United States',    dialCode: '+1'   },
	];

	/** Parse a combined value like "+420 123456789" into country + local parts */
	function parseValue(v: string): { country: PhoneCountry; localNumber: string } {
		const defaultCountry = PHONE_COUNTRIES[0]; // CZ
		if (!v) return { country: defaultCountry, localNumber: '' };

		if (!v.startsWith('+')) return { country: defaultCountry, localNumber: v };

		// Find the longest matching dial code (e.g. +421 beats +42)
		let matched = defaultCountry;
		let maxLen = 0;
		for (const c of PHONE_COUNTRIES) {
			if (v.startsWith(c.dialCode) && c.dialCode.length > maxLen) {
				matched = c;
				maxLen = c.dialCode.length;
			}
		}
		const localNumber = v.slice(maxLen).replace(/^\s+/, '');
		return { country: matched, localNumber };
	}

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

	// ── Internal state ────────────────────────────────────────────────────────
	const initial = parseValue(value);
	let selectedCountry = $state<PhoneCountry>(initial.country);
	let localNumber     = $state(initial.localNumber);

	let originalValue = $state(value);
	let previousValue = $state(value);

	let isFocused    = $state(false);
	let showDropdown = $state(false);
	let searchQuery  = $state('');

	// Re-parse when value is changed externally (form reset / discard)
	$effect(() => {
		if (value !== previousValue) {
			if (!isFocused && !showDropdown) {
				const p = parseValue(value);
				selectedCountry = p.country;
				localNumber     = p.localNumber;
				originalValue   = value;
			}
			previousValue = value;
		}
	});

	const hasChanged = $derived(value !== originalValue);

	// ── Emit ──────────────────────────────────────────────────────────────────
	function emitValue() {
		const combined = localNumber.trim()
			? `${selectedCountry.dialCode} ${localNumber.trim()}`
			: '';
		onChange(field.name, combined);
	}

	function handleCountrySelect(country: PhoneCountry) {
		selectedCountry = country;
		showDropdown    = false;
		searchQuery     = '';
		emitValue();
	}

	function handleNumberInput(e: Event) {
		localNumber = (e.currentTarget as HTMLInputElement).value;
		emitValue();
	}

	// ── Portal dropdown ───────────────────────────────────────────────────────
	let buttonRef: HTMLButtonElement;
	let dropdownRef: HTMLDivElement;
	let portalContainer: HTMLDivElement;
	let dropdownPosition = $state({ top: 0, left: 0, width: 300 });

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
		if (!buttonRef) return;
		const rect             = buttonRef.getBoundingClientRect();
		const maxHeight        = 320;
		const viewportHeight   = window.innerHeight;
		const spaceBelow       = viewportHeight - rect.bottom;
		const spaceAbove       = rect.top;
		const openUpward       = spaceBelow < maxHeight && spaceAbove > spaceBelow;
		const dropWidth        = Math.max(rect.width, 300);

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
		if (!buttonRef?.contains(target) && !dropdownRef?.contains(target)) {
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

	const filteredCountries = $derived.by(() => {
		if (!searchQuery) return PHONE_COUNTRIES;
		const q = searchQuery.toLowerCase();
		return PHONE_COUNTRIES.filter(
			(c) =>
				c.name.toLowerCase().includes(q) ||
				c.dialCode.includes(q) ||
				c.code.toLowerCase().includes(q)
		);
	});

	// ── Visual state ─────────────────────────────────────────────────────────
	const borderGradient = $derived.by(() => {
		if (showError)                           return 'from-red-400 to-red-500';
		if (isFocused || showDropdown)           return 'from-indigo-500 via-purple-500 to-pink-500';
		if (value && !error && hasChanged)       return 'from-emerald-400 to-teal-500';
		return '';
	});

	const bgTrigger = $derived.by(() => {
		if (showError)   return 'bg-red-50/50';
		if (showDropdown) return 'bg-indigo-50/30';
		return 'bg-white';
	});
</script>

<div class="relative">
	<!-- Gradient border wrapper -->
	<div
		class="relative rounded-xl p-[2px] transition-all duration-200
		       {borderGradient ? `bg-gradient-to-r ${borderGradient}` : 'bg-slate-300'}"
	>
		<!-- Inner row: country picker + number input -->
		<div class="relative flex bg-white rounded-[11px] overflow-hidden">

			<!-- ── Country code trigger ────────────────────────────────── -->
			<button
				bind:this={buttonRef}
				type="button"
				onclick={toggleDropdown}
				{disabled}
				class="flex items-center gap-1.5 pl-3 pr-2.5 py-3 border-r border-slate-200
				       flex-shrink-0 select-none transition-colors duration-150
				       {bgTrigger}
				       {disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-slate-50'}"
				aria-haspopup="listbox"
				aria-expanded={showDropdown}
				title="Select country code"
			>
				<!-- Flat flag -->
				<span class="fi fi-{selectedCountry.code.toLowerCase()} flag-sm flex-shrink-0"></span>

				<!-- Dial code -->
				<span class="text-sm font-medium text-slate-700 tabular-nums min-w-[36px]">
					{selectedCountry.dialCode}
				</span>

				<!-- Chevron -->
				<ChevronDown
					class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200
					       {showDropdown ? 'rotate-180 text-indigo-600' : ''}"
				/>
			</button>

			<!-- ── Local number input ──────────────────────────────────── -->
			<input
				type="tel"
				name={field.name}
				value={localNumber}
				oninput={handleNumberInput}
				onfocus={() => (isFocused = true)}
				onblur={() => (isFocused = false)}
				placeholder={field.placeholder ?? '123 456 789'}
				{disabled}
				maxlength={field.maxLength}
				class="flex-1 min-w-0 px-3 pr-10 py-3 text-sm bg-transparent
				       focus:outline-none placeholder:text-slate-400
				       disabled:text-slate-500 disabled:cursor-not-allowed
				       {showError ? 'text-red-900' : 'text-slate-900'}"
			/>

			<!-- Validation indicator -->
			<div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
				<FormValidationIndicator
					hasValue={!!localNumber}
					hasError={!!error}
					{showError}
					isTouched={hasChanged}
					variant="default"
				/>
			</div>
		</div>
	</div>
</div>

<!-- ── Dropdown (moved to portal) ────────────────────────────────────────── -->
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
					placeholder="Search country or code…"
					class="w-full pl-9 pr-3 py-2 text-sm border border-indigo-200 rounded-lg
					       bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					onclick={(e) => e.stopPropagation()}
				/>
			</div>
		</div>

		<!-- Options list -->
		<div class="max-h-64 overflow-y-auto custom-scrollbar">
			{#if filteredCountries.length > 0}
				<div class="py-1">
					{#each filteredCountries as country (country.code)}
						<button
							type="button"
							role="option"
							aria-selected={country.code === selectedCountry.code}
							onclick={() => handleCountrySelect(country)}
							class="w-full px-3 py-2.5 text-left flex items-center gap-3
							       transition-colors duration-100
							       {country.code === selectedCountry.code
							           ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900'
							           : 'hover:bg-slate-50 text-slate-700'}"
						>
							<!-- Flat flag -->
							<span class="fi fi-{country.code.toLowerCase()} flag-sm flex-shrink-0"></span>

							<!-- Country name -->
							<span class="flex-1 text-sm truncate">{country.name}</span>

							<!-- Dial code -->
							<span class="text-sm font-mono text-slate-500 flex-shrink-0 tabular-nums">
								{country.dialCode}
							</span>

							<!-- Selected check -->
							{#if country.code === selectedCountry.code}
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
			{filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'}
		</div>
	</div>
{/if}

<style>
	/* Flat flag size — used in both trigger and dropdown rows */
	:global(.flag-sm) {
		width: 22px;
		height: 16px;
		border-radius: 2px;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08); /* subtle border for white-edge flags */
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
