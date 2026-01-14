<script lang="ts">
	import { AlertCircle, Check, CheckCircle2, XCircle } from 'lucide-svelte';

	interface Props {
		hasValue: boolean;
		hasError: boolean;
		showError: boolean;
		isTouched?: boolean;
		position?: 'right-3' | 'right-8' | 'right-0';
		variant?: 'default' | 'minimal' | 'filled';  // Different visual styles
	}

	let {
		hasValue,
		hasError,
		showError,
		isTouched = false,
		position = 'right-3',
		variant = 'default'
	}: Props = $props();

	// Determine which style to use based on variant
	const showSuccess = $derived(hasValue && !hasError && isTouched);
</script>

<!-- Success Indicator -->
{#if showSuccess}
	{#if variant === 'filled'}
		<!-- Filled circle variant with gradient -->
		<div class="success-indicator">
			<div class="success-badge">
				<Check class="w-3 h-3 text-white" strokeWidth={3} />
			</div>
		</div>
	{:else if variant === 'minimal'}
		<!-- Minimal checkmark only -->
		<div class="success-indicator-minimal">
			<Check class="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
		</div>
	{:else}
		<!-- Default: Checkmark with subtle glow -->
		<div class="success-indicator-default">
			<div class="success-glow"></div>
			<Check class="w-4 h-4 text-emerald-500 relative z-10" strokeWidth={2.5} />
		</div>
	{/if}
{/if}

<!-- Error Indicator -->
{#if showError}
	{#if variant === 'filled'}
		<!-- Filled circle variant -->
		<div class="error-indicator">
			<div class="error-badge">
				<AlertCircle class="w-3 h-3 text-white" strokeWidth={3} />
			</div>
		</div>
	{:else if variant === 'minimal'}
		<!-- Minimal error icon only -->
		<div class="error-indicator-minimal">
			<AlertCircle class="w-4 h-4 text-red-500" strokeWidth={2.5} />
		</div>
	{:else}
		<!-- Default: Error icon with pulse -->
		<div class="error-indicator-default">
			<div class="error-pulse"></div>
			<AlertCircle class="w-4 h-4 text-red-500 relative z-10" strokeWidth={2.5} />
		</div>
	{/if}
{/if}

<style>
    /* ============================================
			 SUCCESS INDICATORS
			 ============================================ */

    /* Filled Badge Variant */
    .success-indicator {
        animation: scale-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .success-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        box-shadow:
                0 2px 8px rgba(16, 185, 129, 0.3),
                0 0 0 2px rgba(16, 185, 129, 0.1);
        animation: success-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* Default: Checkmark with Glow */
    .success-indicator-default {
        position: relative;
        animation: scale-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .success-glow {
        position: absolute;
        inset: -4px;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
        border-radius: 50%;
        animation: glow-pulse 2s ease-in-out infinite;
    }

    /* Minimal Variant */
    .success-indicator-minimal {
        animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* ============================================
			 ERROR INDICATORS
			 ============================================ */

    /* Filled Badge Variant */
    .error-indicator {
        animation: shake-scale 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
    }

    .error-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        box-shadow:
                0 2px 8px rgba(239, 68, 68, 0.3),
                0 0 0 2px rgba(239, 68, 68, 0.1);
        animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
    }

    /* Default: Error with Pulse */
    .error-indicator-default {
        position: relative;
        animation: shake-scale 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
    }

    .error-pulse {
        position: absolute;
        inset: -4px;
        background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        animation: error-pulse-animation 1.5s ease-in-out infinite;
    }

    /* Minimal Variant */
    .error-indicator-minimal {
        animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
    }

    /* ============================================
			 ANIMATIONS
			 ============================================ */

    /* Scale Bounce - Success Entry */
    @keyframes scale-bounce {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.15);
        }
        70% {
            transform: scale(0.95);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    /* Success Badge Bounce */
    @keyframes success-bounce {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    /* Error Badge Shake */
    @keyframes error-shake {
        0%, 100% {
            transform: translateX(0) scale(1);
        }
        25% {
            transform: translateX(-3px) scale(1.05);
        }
        50% {
            transform: translateX(3px) scale(1.05);
        }
        75% {
            transform: translateX(-2px) scale(1.02);
        }
    }

    /* Shake with Scale - Error Entry */
    @keyframes shake-scale {
        0% {
            transform: translateX(0) scale(0);
            opacity: 0;
        }
        25% {
            transform: translateX(-4px) scale(1.1);
            opacity: 1;
        }
        50% {
            transform: translateX(4px) scale(1.05);
        }
        75% {
            transform: translateX(-3px) scale(1.02);
        }
        100% {
            transform: translateX(0) scale(1);
        }
    }

    /* Simple Scale In */
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

    /* Simple Shake */
    @keyframes shake {
        0%, 100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-4px);
        }
        75% {
            transform: translateX(4px);
        }
    }

    /* Glow Pulse - Success Ambient */
    @keyframes glow-pulse {
        0%, 100% {
            opacity: 0.3;
            transform: scale(1);
        }
        50% {
            opacity: 0.6;
            transform: scale(1.2);
        }
    }

    /* Error Pulse - Error Ambient */
    @keyframes error-pulse-animation {
        0%, 100% {
            opacity: 0.2;
            transform: scale(1);
        }
        50% {
            opacity: 0.4;
            transform: scale(1.3);
        }
    }

    /* ============================================
			 ACCESSIBILITY
			 ============================================ */

    /* Respect prefers-reduced-motion */
    @media (prefers-reduced-motion: reduce) {
        .success-indicator,
        .success-indicator-default,
        .success-indicator-minimal,
        .error-indicator,
        .error-indicator-default,
        .error-indicator-minimal,
        .success-badge,
        .error-badge,
        .success-glow,
        .error-pulse {
            animation: none !important;
            transition: none !important;
        }
    }
</style>