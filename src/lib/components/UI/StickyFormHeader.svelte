<script lang="ts">
	import { AlertCircle, Save, X, ArrowLeft, ChevronRight } from 'lucide-svelte';
	import { onMount } from 'svelte';

	interface Props {
		title: string;
		subtitle?: string;
		backUrl?: string;
		hasChanges?: boolean;
		isSaving?: boolean;
		isValid?: boolean;
		errors?: Record<string, string>;
		onSave?: () => void;
		onDiscard?: () => void;
		onBack?: () => void;
		className?: string;
		saveLabel?: string;
		discardLabel?: string;
	}

	let {
		title,
		subtitle,
		backUrl,
		hasChanges = false,
		isSaving = false,
		isValid = true,
		errors = {},
		onSave,
		onDiscard,
		onBack,
		className = '',
		saveLabel = 'Save Changes',
		discardLabel = 'Discard'
	}: Props = $props();

	// Error carousel state
	let currentErrorIndex = $state(0);
	let errorEntries = $derived(Object.entries(errors));
	let hasErrors = $derived(errorEntries.length > 0);

	// Cycle through errors every 3 seconds
	let intervalId: number | undefined;

	$effect(() => {
		if (hasErrors && errorEntries.length > 1) {
			// Clear any existing interval
			if (intervalId) clearInterval(intervalId);

			// Start new interval
			intervalId = setInterval(() => {
				currentErrorIndex = (currentErrorIndex + 1) % errorEntries.length;
			}, 3000);

			return () => {
				if (intervalId) clearInterval(intervalId);
			};
		} else {
			currentErrorIndex = 0;
		}
	});

	// Dynamic background based on state
	const bgClass = $derived(() => {
		if (hasChanges && !isValid) {
			// Has changes but invalid - RED gradient
			return 'bg-gradient-to-r from-red-500 via-red-600 to-orange-500 border-red-600';
		} else if (hasChanges) {
			// Has changes and valid - ORANGE gradient
			return 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 border-orange-600';
		}
		// Clean state - white
		return 'bg-white/95 border-slate-200';
	});

	// Text color based on state
	const textClass = $derived(() => {
		if (hasChanges) {
			return 'text-white';
		}
		return 'text-slate-900';
	});

	// Subtitle text color
	const subtitleClass = $derived(() => {
		if (hasChanges) {
			return 'text-white/90';
		}
		return 'text-slate-500';
	});

	// Save button style
	const saveButtonClass = $derived(() => {
		const base = 'px-6 py-2 text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2';

		if (hasChanges && isValid) {
			return `${base} text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 ring-2 ring-white/30`;
		}

		return `${base} text-slate-700 bg-white border border-slate-300 hover:bg-slate-50`;
	});

	// Discard button style
	const discardButtonClass = $derived(() => {
		const base = 'px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2';

		if (hasChanges) {
			return `${base} text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30`;
		}

		return `${base} text-slate-700 bg-white border border-slate-300 hover:bg-slate-50`;
	});

	// Back button style
	const backButtonClass = $derived(() => {
		if (hasChanges) {
			return 'p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm';
		}
		return 'p-2 hover:bg-slate-100 rounded-lg transition-colors';
	});

	// Indicator badge style
	const indicatorClass = $derived(() => {
		if (hasChanges && !isValid) {
			return 'bg-white/95 border-white/50 text-red-700';
		}
		return 'bg-white border-white/50 text-amber-700';
	});

	function handleBack() {
		if (onBack) {
			onBack();
		} else if (backUrl) {
			window.location.href = backUrl;
		}
	}

	// Get field label from field name (capitalize and format)
	function formatFieldLabel(fieldName: string): string {
		return fieldName
			.split(/(?=[A-Z])/)
			.join(' ')
			.replace(/^./, str => str.toUpperCase());
	}
</script>

<div class="sticky top-0 z-50 mb-6 {className}">
	<div class="backdrop-blur-sm border rounded-xl shadow-lg px-6 py-4 transition-all duration-300 {bgClass()}">
		<div class="flex items-center justify-between">
			<!-- Left: Back button and title -->
			<div class="flex items-center gap-4">
				{#if backUrl || onBack}
					<button
						type="button"
						onclick={handleBack}
						class="{backButtonClass()}"
						aria-label="Go back"
					>
						<ArrowLeft class="w-5 h-5 {hasChanges ? 'text-white' : 'text-slate-600'}" />
					</button>
				{/if}

				<div class="flex-1">
					<h1 class="text-xl font-bold {textClass()}">{title}</h1>
					{#if subtitle}
						<p class="text-sm {subtitleClass()}">{subtitle}</p>
					{/if}
				</div>
			</div>

			<!-- Right: Status and actions -->
			<div class="flex items-center gap-3">
				<!-- Unsaved changes indicator -->
				{#if hasChanges && isValid}
					<div class="flex items-center gap-2 px-3 py-1.5 {indicatorClass()} rounded-lg shadow-sm border">
						<div class="w-2 h-2 bg-current rounded-full animate-pulse"></div>
						<span class="text-sm font-medium">Unsaved changes</span>
					</div>
				{/if}

				<!-- Animated Error Carousel -->
				{#if hasChanges && hasErrors}
					<div class="flex items-center gap-2 px-3 py-1.5 bg-white/95 border border-white/50 rounded-lg shadow-sm min-w-[300px]">
						<AlertCircle class="w-4 h-4 text-red-600 flex-shrink-0" />
						<div class="flex-1 overflow-hidden">
							{#each errorEntries as [fieldName, errorMessage], index}
								{#if index === currentErrorIndex}
									<div
										class="text-sm text-red-700 animate-in fade-in slide-in-from-right-2 duration-300"
										key={fieldName}
									>
										<strong class="font-medium">{formatFieldLabel(fieldName)}:</strong>
										<span class="ml-1">{errorMessage}</span>
									</div>
								{/if}
							{/each}
						</div>
						{#if errorEntries.length > 1}
							<div class="flex items-center gap-1 text-xs text-red-600 flex-shrink-0">
								<span class="font-medium">{currentErrorIndex + 1}/{errorEntries.length}</span>
								<ChevronRight class="w-3 h-3" />
							</div>
						{/if}
					</div>
				{/if}

				<!-- Action buttons -->
				<button
					type="button"
					onclick={onDiscard}
					disabled={!hasChanges || isSaving}
					class="{discardButtonClass()}"
				>
					<X class="w-4 h-4" />
					{discardLabel}
				</button>

				<button
					type="button"
					onclick={onSave}
					disabled={isSaving || !hasChanges || !isValid}
					class="{saveButtonClass()}"
				>
					{#if isSaving}
						<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						<span>Saving...</span>
					{:else}
						<Save class="w-4 h-4" />
						<span>{saveLabel}</span>
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slide-in-from-right-2 {
        from {
            transform: translateX(0.5rem);
        }
        to {
            transform: translateX(0);
        }
    }

    .animate-in {
        animation: fade-in 0.3s ease-out, slide-in-from-right-2 0.3s ease-out;
    }
</style>