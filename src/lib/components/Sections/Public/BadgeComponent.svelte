<script lang="ts">
	import type { ComponentType } from 'svelte';
	import type { Icon } from 'lucide-svelte';

	interface Props {
		// Content
		text: string;
		icon?: ComponentType<Icon>;

		// Styling
		variant?: 'transparent' | 'solid' | 'gradient';
		size?: 'sm' | 'md' | 'lg';
		position?: 'left' | 'center' | 'right';

		// Colors (follows Tailwind color system)
		iconColor?: string;
		gradientFrom?: string;
		gradientVia?: string;
		gradientTo?: string;

		// Behavior
		animated?: boolean;
		hoverable?: boolean;
		scale?: number;

		// Additional classes
		class?: string;
	}

	let {
		text,
		icon,
		variant = 'transparent',
		size = 'md',
		position = 'center',
		iconColor = 'text-blue-600 dark:text-blue-400',
		gradientFrom = 'from-blue-600',
		gradientVia = 'via-purple-600',
		gradientTo = 'to-cyan-600',
		animated = true,
		hoverable = true,
		scale = 1.05,
		class: className = ''
	}: Props = $props();

	// Size configurations (similar to Spring Boot's @ConfigurationProperties)
	const sizeConfig = {
		sm: {
			padding: 'px-4 py-2',
			text: 'text-xs',
			icon: 'w-3 h-3',
			gap: 'gap-1.5'
		},
		md: {
			padding: 'px-6 py-3',
			text: 'text-sm',
			icon: 'w-4 h-4',
			gap: 'gap-2'
		},
		lg: {
			padding: 'px-8 py-4',
			text: 'text-base',
			icon: 'w-5 h-5',
			gap: 'gap-2.5'
		}
	};

	// Position configurations
	const positionConfig = {
		left: 'justify-start',
		center: 'justify-center',
		right: 'justify-end'
	};

	// Variant configurations
	const variantConfig = {
		transparent: {
			background: 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm',
			border: 'border border-white/20 dark:border-gray-700/30',
			innerBg: ''
		},
		solid: {
			background: 'bg-white dark:bg-gray-900',
			border: 'border border-gray-200 dark:border-gray-700',
			innerBg: ''
		},
		gradient: {
			background: `bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo}`,
			border: '',
			innerBg: ''
		}
	};

	// Derive computed values (similar to @Derived in Spring)
	const currentSize = $derived(sizeConfig[size]);
	const currentPosition = $derived(positionConfig[position]);
	const currentVariant = $derived(variantConfig[variant]);
	const hoverScale = $derived(hoverable ? `hover:scale-[${scale}]` : '');
	const iconAnimation = $derived(animated ? 'animate-pulse' : '');

	// Build gradient text class
	const gradientTextClass = $derived(
		variant === 'gradient'
			? 'text-white'
			: `bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} bg-clip-text text-transparent`
	);
</script>

<div class="flex {currentPosition} {className}">
	<div
		class="group inline-flex items-center {currentSize.gap} {currentSize.padding}
		       relative overflow-hidden rounded-full
		       transition-all duration-500 {hoverScale}"
	>
		{#if variant === 'transparent'}
			<!-- Glassmorphism background for transparent variant -->
			<div class="absolute inset-0 {currentVariant.background} {currentVariant.border} rounded-full"></div>

			<!-- Animated border gradient on hover -->
			<div class="absolute inset-0 bg-gradient-to-r {gradientFrom} {gradientVia} {gradientTo} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
			<div class="absolute inset-[1px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full"></div>
		{:else if variant === 'solid'}
			<!-- Solid background variant -->
			<div class="absolute inset-0 {currentVariant.background} {currentVariant.border} rounded-full"></div>

			<!-- Optional animated border on hover -->
			{#if hoverable}
				<div class="absolute inset-0 bg-gradient-to-r {gradientFrom} {gradientVia} {gradientTo} rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
			{/if}
		{:else if variant === 'gradient'}
			<!-- Gradient background variant -->
			<div class="absolute inset-0 {currentVariant.background} rounded-full"></div>

			<!-- Glow effect on hover -->
			{#if hoverable}
				<div class="absolute inset-0 {currentVariant.background} rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
			{/if}
		{/if}

		<!-- Content -->
		<div class="relative flex items-center {currentSize.gap}">
			{#if icon}
				<svelte:component
					this={icon}
					class="{currentSize.icon} {iconColor} {iconAnimation}"
				/>
			{/if}
			<span class="{currentSize.text} font-semibold {gradientTextClass}">
				{text}
			</span>
		</div>
	</div>
</div>

<style>
    /* Custom animation for icon pulse */
    :global(.animate-pulse) {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }
</style>