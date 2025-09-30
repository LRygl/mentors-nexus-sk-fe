<script lang="ts">
	import type { FormField } from '$lib/types/entities/forms';
	import { Check, AlertCircle, Copy, CopyCheck } from 'lucide-svelte';

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
		onChange
	}: Props = $props();

	let isFocused = $state(false);
	let hasInteracted = $state(false);
	let justCopied = $state(false);

	// Calculate character count
	const charCount = $derived(value?.length || 0);
	const showCharCount = $derived(field.maxLength && field.maxLength > 0);
	const isNearLimit = $derived(field.maxLength && charCount > field.maxLength * 0.8);
	const isAtLimit = $derived(field.maxLength && charCount >= field.maxLength);

	// Dynamic border gradient
	const borderGradient = $derived(() => {
		if (showError) return 'from-red-400 to-red-500';
		if (isFocused) return 'from-indigo-500 via-purple-500 to-pink-500';
		if (value && !error) return 'from-emerald-400 to-teal-500';
		return '';
	});

	// Background styling
	const bgStyle = $derived(() => {
		if (showError) return 'bg-red-50/50';
		if (value && !error && !isFocused) return 'bg-emerald-50/20';
		return 'bg-white';
	});

	function handleFocus() {
		isFocused = true;
		hasInteracted = true;
	}

	function handleBlur() {
		isFocused = false;
	}

	async function copyToClipboard() {
		if (!value) return;

		try {
			await navigator.clipboard.writeText(value);
			justCopied = true;
			setTimeout(() => {
				justCopied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<div class="relative group">
	<!-- Gradient Border Container -->
	<div class="relative rounded-xl p-[2px] transition-all duration-200 {borderGradient() ? `bg-gradient-to-r ${borderGradient()}` : 'bg-slate-300'}">
		<!-- Input Container -->
		<div class="relative bg-white rounded-[11px]">
			<input
				type="text"
				name={field.name}
				bind:value
				oninput={(e) => {
					const target = e.currentTarget;
					onChange(field.name, target.value);
				}}
				onfocus={handleFocus}
				onblur={handleBlur}
				placeholder={field.placeholder}
				disabled={disabled}
				minlength={field.minLength}
				maxlength={field.maxLength}
				pattern={field.pattern}
				class="
					w-full px-4 py-3 text-sm rounded-[11px]
					{bgStyle()}
					transition-all duration-200 ease-out
					placeholder:text-slate-400
					disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
					focus:outline-none
					{isFocused ? 'shadow-lg shadow-indigo-100/50' : 'shadow-sm'}
					{showError || value ? 'pr-24' : 'pr-4'}
				"
			/>

			<!-- Action Icons -->
			<div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
				<!-- Character Count -->
				{#if showCharCount && (isFocused || value)}
					<span
						class="text-xs font-medium transition-colors duration-200 {
							isAtLimit ? 'text-red-600' :
							isNearLimit ? 'text-amber-600' :
							'text-slate-500'
						}"
					>
						{charCount}/{field.maxLength}
					</span>
				{/if}

				<!-- Copy Button -->
				{#if value && !showError}
					<button
						type="button"
						onclick={copyToClipboard}
						class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all duration-200"
						title="Copy to clipboard"
						aria-label="Copy to clipboard"
					>
						{#if justCopied}
							<CopyCheck class="w-4 h-4 text-emerald-500" />
						{:else}
							<Copy class="w-4 h-4" />
						{/if}
					</button>
				{/if}

				<!-- Success Icon -->
				{#if value && !error && hasInteracted}
					<div class="animate-scale-in">
						<Check class="w-4 h-4 text-emerald-500" />
					</div>
				{/if}

				<!-- Error Icon -->
				{#if showError}
					<div class="animate-shake">
						<AlertCircle class="w-4 h-4 text-red-500" />
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Character count progress bar -->
	{#if showCharCount && value}
		<div class="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
			<div
				class="h-full rounded-full transition-all duration-300 ease-out {
					isAtLimit ? 'bg-gradient-to-r from-red-500 to-red-600' :
					isNearLimit ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
					'bg-gradient-to-r from-indigo-500 to-purple-500'
				}"
				style="width: {Math.min((charCount / (field.maxLength || 1)) * 100, 100)}%"
			></div>
		</div>
	{/if}
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
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
    }

    .animate-scale-in {
        animation: scale-in 0.2s ease-out;
    }

    .animate-shake {
        animation: shake 0.3s ease-out;
    }
</style>