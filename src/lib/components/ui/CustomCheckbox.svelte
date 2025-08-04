<!-- src/lib/components/ui/CustomCheckbox.svelte -->
<script lang="ts">
	import { Check, Minus } from 'lucide-svelte';

	// Props
	export let checked = false;
	export let indeterminate = false;
	export let disabled = false;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' = 'primary';
	export let label = '';
	export let id = '';
	export let value = '';
	export let name = '';

	// Events
	export let onchange: ((event: Event) => void) | undefined = undefined;

	// Size classes
	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6'
	};

	const iconSizes = {
		sm: 'w-3 h-3',
		md: 'w-3.5 h-3.5',
		lg: 'w-4 h-4'
	};

	// Variant classes
	const variantClasses = {
		default: {
			unchecked: 'border-slate-300 bg-white hover:border-slate-400',
			checked: 'border-slate-600 bg-slate-600',
			focus: 'focus:ring-slate-500'
		},
		primary: {
			unchecked: 'border-slate-300 bg-white hover:border-indigo-400',
			checked: 'border-indigo-600 bg-indigo-600',
			focus: 'focus:ring-indigo-500'
		},
		success: {
			unchecked: 'border-slate-300 bg-white hover:border-emerald-400',
			checked: 'border-emerald-600 bg-emerald-600',
			focus: 'focus:ring-emerald-500'
		},
		warning: {
			unchecked: 'border-slate-300 bg-white hover:border-amber-400',
			checked: 'border-amber-600 bg-amber-600',
			focus: 'focus:ring-amber-500'
		},
		danger: {
			unchecked: 'border-slate-300 bg-white hover:border-red-400',
			checked: 'border-red-600 bg-red-600',
			focus: 'focus:ring-red-500'
		}
	};

	// Generate unique ID if not provided
	const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

	// Handle change event
	function handleChange(event: Event) {
		if (onchange) {
			onchange(event);
		}
	}
</script>

<div class="inline-flex items-center gap-2">
	<div class="relative inline-flex items-center">
		<!-- Hidden native checkbox for accessibility -->
		<input
			{id}
			type="checkbox"
			{name}
			{value}
			{disabled}
			bind:checked
			bind:indeterminate
			onchange={handleChange}
			class="sr-only"
		/>

		<!-- Custom checkbox visual -->
		<label
			for={checkboxId}
			class="relative inline-flex items-center justify-center {sizeClasses[size]} border-2 rounded-lg transition-all duration-200 cursor-pointer select-none
			{disabled ? 'opacity-50 cursor-not-allowed' : ''}
			{checked || indeterminate
				? variantClasses[variant].checked
				: variantClasses[variant].unchecked
			}
			{variantClasses[variant].focus} focus-within:ring-2 focus-within:ring-offset-2"
		>
			<!-- Check/Indeterminate Icon -->
			<div class="text-white transition-all duration-200 {checked || indeterminate ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}">
				{#if indeterminate}
					<Minus class={iconSizes[size]} />
				{:else if checked}
					<Check class={iconSizes[size]} />
				{/if}
			</div>

			<!-- Ripple effect on click -->
			<div class="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-150 hover:opacity-10
				{checked || indeterminate ? 'bg-white' : 'bg-slate-900'}"
			></div>
		</label>
	</div>

	<!-- Label text -->
	{#if label}
		<label
			for={checkboxId}
			class="text-sm font-medium text-slate-700 cursor-pointer select-none {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
		>
			{label}
		</label>
	{/if}
</div>

<style>
    /* Ensure focus ring appears correctly */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
</style>