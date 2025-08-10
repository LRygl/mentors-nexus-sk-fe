<script lang="ts">
	import { type Component, type Snippet } from 'svelte';
	import { Loader, Save, X } from 'lucide-svelte';

	// Props interface
	interface Props {
		isOpen: boolean;
		title: string;
		subtitle?: string;
		icon?: Component;
		iconBgColor?: string;
		loading?: boolean;
		error?: string | null;
		submitLabel?: string;
		maxWidth?: string;
		height?: string;
		children?: Snippet;
		onclose?: () => void;
		onsubmit?: (event: Event) => void;
	}

	let {
		isOpen = false,
		title = 'Create Item',
		subtitle = '',
		icon,
		iconBgColor = 'from-indigo-500 to-purple-600',
		loading = false,
		error = null,
		submitLabel = 'Create',
		maxWidth = 'max-w-2xl',
		height = 'max-h-[90vh]',
		children,
		onclose,
		onsubmit
	}: Props = $props();

	// Event handlers
	function handleClose() {
		if (loading) return; // Prevent closing while loading
		onclose?.();
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		onsubmit?.(event);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && !loading) {
			handleClose();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleClose();
		}
	}

	// Focus management
	let modalElement = $state<HTMLElement>();

	$effect(() => {
		if (isOpen && modalElement) {
			// Focus the modal when it opens
			modalElement.focus();

			// Prevent body scroll
			document.body.style.overflow = 'hidden';

			return () => {
				document.body.style.overflow = '';
			};
		}
	});

</script>

<!-- Modal Backdrop -->
{#if isOpen}
	<div
		class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		aria-describedby={subtitle ? "modal-subtitle" : undefined}
		tabindex="0"
	>
		<!-- Modal Content -->
		<div
			bind:this={modalElement}
			class="bg-white rounded-2xl shadow-2xl {maxWidth} w-full {height} overflow-hidden animate-modal-enter"
			onclick={(e) => e.stopPropagation()}
			role="none"
			tabindex="-1"
		>
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
				<div class="flex items-center gap-3">
					{#if icon}
						<div class="w-10 h-10 bg-gradient-to-r {iconBgColor} rounded-lg flex items-center justify-center">
							<svelte:component this={icon} class="w-5 h-5 text-white" />
						</div>
					{/if}

					<div>
						<h2 id="modal-title" class="text-xl font-semibold text-gray-900">
							{title}
						</h2>
						{#if subtitle}
							<p id="modal-subtitle" class="text-sm text-gray-600">
								{subtitle}
							</p>
						{/if}
					</div>
				</div>

				<button
					onclick={handleClose}
					disabled={loading}
					class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
					aria-label="Close modal"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Error Banner -->
			{#if error}
				<div class="bg-red-50 border-l-4 border-red-400 p-4 m-6 mb-0 rounded-lg">
					<div class="flex">
						<div class="ml-3">
							<p class="text-sm text-red-700 font-medium">
								Error creating {title.toLowerCase()}
							</p>
							<p class="text-sm text-red-600 mt-1">
								{error}
							</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Modal Body (Scrollable) -->
			<div class="flex-1 overflow-y-auto">
				<form onsubmit={handleSubmit} class="p-6 space-y-6">
					<!-- Dynamic Content Slot -->
					{#if children}
						{@render children()}
					{/if}

					<!-- Form Actions -->
					<div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
						<button
							type="button"
							onclick={handleClose}
							disabled={loading}
							class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>

						<button
							type="submit"
							disabled={loading}
							class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if loading}
								<Loader class="w-4 h-4 animate-spin" />
								Creating...
							{:else}
								<Save class="w-4 h-4" />
								{submitLabel}
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
    @keyframes modal-enter {
        0% {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    .animate-modal-enter {
        animation: modal-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Focus styles for accessibility */
    div[role="none"]:focus {
        outline: none;
    }
</style>