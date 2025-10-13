<script lang="ts">
	import { AlertCircle, CheckCircle2, Info, AlertTriangle, HelpCircle, Delete, TrashIcon } from 'lucide-svelte';
	import { confirmationModal, type ConfirmVariant } from '$lib/components/Modals/ConfirmationModalService.svelte';

	// Get reactive state from service
	const { state } = $derived(confirmationModal);

	// Variant configurations with improved color schemes
	const variantConfig = {
		confirm: {
			icon: HelpCircle,
			iconBg: 'bg-blue-500',
			iconRing: 'ring-blue-100',
			iconColor: 'text-white',
			titleColor: 'text-gray-900',
			messageColor: 'text-gray-600',
			confirmButtonBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
			cancelButtonBorder: 'border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
			borderColor: 'border-gray-200'
		},
		success: {
			icon: CheckCircle2,
			iconBg: 'bg-green-500',
			iconRing: 'ring-green-100',
			iconColor: 'text-white',
			titleColor: 'text-gray-900',
			messageColor: 'text-gray-600',
			confirmButtonBg: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
			cancelButtonBorder: 'border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
			borderColor: 'border-green-200'
		},
		warning: {
			icon: AlertTriangle,
			iconBg: 'bg-amber-500',
			iconRing: 'ring-amber-100',
			iconColor: 'text-white',
			titleColor: 'text-gray-900',
			messageColor: 'text-gray-600',
			confirmButtonBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
			cancelButtonBorder: 'border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
			borderColor: 'border-amber-200'
		},
		error: {
			icon: AlertCircle,
			iconBg: 'bg-red-500',
			iconRing: 'ring-red-100',
			iconColor: 'text-white',
			titleColor: 'text-gray-900',
			messageColor: 'text-gray-600',
			confirmButtonBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
			cancelButtonBorder: 'border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
			borderColor: 'border-red-200'
		},
		info: {
			icon: Info,
			iconBg: 'bg-indigo-500',
			iconRing: 'ring-indigo-100',
			iconColor: 'text-white',
			titleColor: 'text-gray-900',
			messageColor: 'text-gray-600',
			confirmButtonBg: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
			cancelButtonBorder: 'border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
			borderColor: 'border-indigo-200'
		},
		delete: {
			icon: TrashIcon,
			iconBg: 'bg-red-500',
			iconRing: 'ring-red-100',
			iconColor: 'text-white',
			titleColor: 'text-gray-900',
			messageColor: 'text-gray-600',
			confirmButtonBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
			cancelButtonBorder: 'border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
			borderColor: 'border-red-200'
		}
	} satisfies Record<ConfirmVariant, any>;

	// Get current variant config
	const config = $derived(variantConfig[state.variant || 'confirm']);
	const IconComponent = $derived(config.icon);

	// Event handlers
	function handleConfirm() {
		confirmationModal.handleConfirm();
	}

	function handleCancel() {
		confirmationModal.handleCancel();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget && state.showCancel) {
			handleCancel();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && state.showCancel) {
			handleCancel();
		} else if (event.key === 'Enter') {
			handleConfirm();
		}
	}

	// Focus management
	let modalElement = $state<HTMLElement>();

	$effect(() => {
		if (state.isOpen && modalElement) {
			modalElement.focus();
			document.body.style.overflow = 'hidden';

			return () => {
				document.body.style.overflow = '';
			};
		}
	});
</script>

<!-- Modal Backdrop -->
{#if state.isOpen}
	<div
		class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="confirm-title"
		aria-describedby="confirm-message"
		tabindex="0"
	>
		<!-- Modal Content -->
		<div
			bind:this={modalElement}
			class="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-modal-enter"
			onclick={(e) => e.stopPropagation()}
			role="none"
			tabindex="-1"
		>
			<!-- Modal Body - Centered Content -->
			<div class="p-8">
				<!-- Icon - Centered -->
				<div class="flex justify-center mb-4">
					<div class="w-14 h-14 {config.iconBg} rounded-full flex items-center justify-center ring-8 {config.iconRing}">
						<svelte:component this={IconComponent} class="w-7 h-7 {config.iconColor}" />
					</div>
				</div>

				<!-- Text Content - Centered -->
				<div class="text-center mb-6">
					<h3 id="confirm-title" class="text-xl font-semibold {config.titleColor} mb-2">
						{state.title}
					</h3>
					<p id="confirm-message" class="text-sm {config.messageColor} leading-relaxed">
						{state.message}
					</p>
				</div>

				<!-- Action Buttons - Centered -->
				<div class="flex items-center justify-center gap-3 pt-4 border-t {config.borderColor}">
					{#if state.showCancel}
						<button
							type="button"
							onclick={handleCancel}
							class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border {config.cancelButtonBorder} rounded-lg focus:ring-2 focus:ring-offset-2 transition-all duration-200"
						>
							{state.cancelLabel}
						</button>
					{/if}

					<button
						type="button"
						onclick={handleConfirm}
						class="px-5 py-2.5 text-sm font-medium text-white {config.confirmButtonBg} rounded-lg focus:ring-2 focus:ring-offset-2 transition-all duration-200 min-w-[100px]"
					>
						{state.confirmLabel}
					</button>
				</div>
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

    div[role="none"]:focus {
        outline: none;
    }
</style>