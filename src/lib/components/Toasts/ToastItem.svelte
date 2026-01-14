<script lang="ts">
	import { CheckCircle2, AlertTriangle, AlertCircle, Info, Bell, X } from 'lucide-svelte';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import type { Toast, ToastVariant } from '$lib/types/entities/ToastTypes';

	interface Props {
		toast: Toast;
	}

	let { toast }: Props = $props();

	// Variant configurations
	const variantConfig = {
		success: {
			icon: CheckCircle2,
			bgColor: 'bg-green-50',
			borderColor: 'border-green-200',
			iconBg: 'bg-green-500',
			iconColor: 'text-white',
			titleColor: 'text-green-900',
			messageColor: 'text-green-700',
			closeHover: 'hover:bg-green-100'
		},
		warning: {
			icon: AlertTriangle,
			bgColor: 'bg-amber-50',
			borderColor: 'border-amber-200',
			iconBg: 'bg-amber-500',
			iconColor: 'text-white',
			titleColor: 'text-amber-900',
			messageColor: 'text-amber-700',
			closeHover: 'hover:bg-amber-100'
		},
		error: {
			icon: AlertCircle,
			bgColor: 'bg-red-50',
			borderColor: 'border-red-200',
			iconBg: 'bg-red-500',
			iconColor: 'text-white',
			titleColor: 'text-red-900',
			messageColor: 'text-red-700',
			closeHover: 'hover:bg-red-100'
		},
		info: {
			icon: Info,
			bgColor: 'bg-blue-50',
			borderColor: 'border-blue-200',
			iconBg: 'bg-blue-500',
			iconColor: 'text-white',
			titleColor: 'text-blue-900',
			messageColor: 'text-blue-700',
			closeHover: 'hover:bg-blue-100'
		},
		default: {
			icon: Bell,
			bgColor: 'bg-gray-50',
			borderColor: 'border-gray-200',
			iconBg: 'bg-gray-500',
			iconColor: 'text-white',
			titleColor: 'text-gray-900',
			messageColor: 'text-gray-700',
			closeHover: 'hover:bg-gray-100'
		}
	} satisfies Record<ToastVariant, any>;

	const config = $derived(variantConfig[toast.variant]);
	const IconComponent = $derived(config.icon);

	// Progress bar for timed toasts
	let progressWidth = $state(100);
	let progressInterval: number | undefined;

	$effect(() => {
		if (toast.duration > 0) {
			const startTime = Date.now();
			const updateInterval = 50; // Update every 50ms for smooth animation

			progressInterval = setInterval(() => {
				const elapsed = Date.now() - toast.createdAt;
				const remaining = Math.max(0, toast.duration - elapsed);
				progressWidth = (remaining / toast.duration) * 100;

				if (remaining <= 0) {
					clearInterval(progressInterval);
				}
			}, updateInterval);

			return () => {
				if (progressInterval) {
					clearInterval(progressInterval);
				}
			};
		}
	});

	function handleDismiss() {
		toastService.dismiss(toast.id);
	}

	function handleActionClick() {
		if (toast.action) {
			toast.action.onClick();
			toastService.dismiss(toast.id);
		}
	}
</script>

<div
	class="w-full max-w-sm {config.bgColor} border {config.borderColor} rounded-lg shadow-lg overflow-hidden animate-toast-enter"
	role="alert"
	aria-live="polite"
	aria-atomic="true"
>
	<!-- Toast Content -->
	<div class="p-4">
		<div class="flex items-start gap-3">
			<!-- Icon -->
			<div class="flex-shrink-0 w-10 h-10 {config.iconBg} rounded-lg flex items-center justify-center">
				<svelte:component this={IconComponent} class="w-5 h-5 {config.iconColor}" />
			</div>

			<!-- Content -->
			<div class="flex-1 min-w-0">
				<h4 class="text-sm font-semibold {config.titleColor} mb-1">
					{toast.title}
				</h4>
				<p class="text-sm {config.messageColor}">
					{toast.message}
				</p>

				<!-- Action Link -->
				{#if toast.action}
					<button
						onclick={handleActionClick}
						class="mt-2 text-sm font-medium {config.titleColor} hover:underline focus:outline-none focus:underline"
					>
						{toast.action.label} →
					</button>
				{/if}

				<!-- Debug Info -->
				{#if toastService.settings.debugMode && toast.debugInfo}
					<details class="mt-2">
						<summary class="text-xs {config.messageColor} cursor-pointer hover:underline">
							Debug Info
						</summary>
						<pre class="mt-1 text-xs {config.messageColor} bg-white/50 p-2 rounded overflow-auto max-h-32">
{JSON.stringify(toast.debugInfo, null, 2)}
						</pre>
					</details>
				{/if}
			</div>

			<!-- Close Button -->
			{#if toast.dismissible}
				<button
					onclick={handleDismiss}
					class="flex-shrink-0 p-1.5 text-gray-400 {config.closeHover} rounded-lg transition-colors"
					aria-label="Close notification"
				>
					<X class="w-4 h-4" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Progress Bar -->
	{#if toast.duration > 0}
		<div class="h-1 bg-black/5">
			<div
				class="{config.iconBg} h-full transition-all duration-100 ease-linear"
				style="width: {progressWidth}%"
			></div>
		</div>
	{/if}
</div>

<style>
    @keyframes toast-enter {
        0% {
            opacity: 0;
            transform: translateY(-1rem) scale(0.95);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .animate-toast-enter {
        animation: toast-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
</style>