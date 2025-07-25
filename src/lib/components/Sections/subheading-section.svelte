<!-- Subheading.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		text: string;
		size?: 'small' | 'medium' | 'large';
		variant?: 'gradient' | 'glow' | 'minimal' | 'animated';
		centered?: boolean;
		animate?: boolean;
	}

	let {
		text,
		size = 'medium',
		variant = 'gradient',
		centered = true,
		animate = true
	}: Props = $props();

	let headingElement: HTMLElement;
	let isVisible = $state(!animate); // Start as visible if no animation

	onMount(() => {
		if (animate) {
			// Small delay to ensure element is rendered
			setTimeout(() => {
				const observer = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting) {
								isVisible = true;
							}
						});
					},
					{ threshold: 0.1 }
				);

				if (headingElement) {
					observer.observe(headingElement);
				}

				return () => observer.disconnect();
			}, 100);
		}
	});

	// Size classes using Tailwind
	const sizeClasses = {
		small: 'text-2xl md:text-3xl lg:text-4xl',
		medium: 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
		large: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
	};

	// Base classes
	const baseClasses = 'font-bold transition-all duration-700 ease-out transform';
	const centerClass = centered ? 'text-center' : '';

	// Animation classes - ensure content is always visible
	const animationClasses = animate
		? (isVisible
			? 'opacity-100 translate-y-0'
			: 'opacity-0 translate-y-8')
		: 'opacity-100 translate-y-0';
</script>

<div class="relative mb-16 group" bind:this={headingElement}>
	{#if variant === 'gradient'}
		<h3
			class="{sizeClasses[size]} {baseClasses} {centerClass} {animationClasses}
             bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600
             bg-clip-text text-transparent hover:scale-105"
		>
			{text}
		</h3>

	{:else if variant === 'glow'}
		<h3
			class="{sizeClasses[size]} {baseClasses} {centerClass} {animationClasses}
             text-slate-800 dark:text-white relative hover:scale-105
             drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]"
		>
			{text}
		</h3>

	{:else if variant === 'animated'}
		<h3
			class="{sizeClasses[size]} {baseClasses} {centerClass} {animationClasses}
             relative overflow-hidden hover:scale-105"
		>
			<!-- Main text with gradient -->
			<span class="relative z-10 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900
                   dark:from-white dark:via-gray-100 dark:to-white
                   bg-clip-text text-transparent">
        {text}
      </span>

			<!-- Animated background shimmer -->
			<div class="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent
                  blur-sm animate-pulse"></div>

			<!-- Moving highlight effect -->
			<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                  translate-x-[-100%] group-hover:translate-x-[100%]
                  transition-transform duration-1000 ease-in-out skew-x-12"></div>
		</h3>

	{:else}
		<!-- Minimal variant -->
		<div class="relative">
			<h3
				class="{sizeClasses[size]} {baseClasses} {centerClass} {animationClasses}
               text-slate-800 dark:text-slate-100 hover:scale-105"
			>
				{text}
			</h3>

			<!-- Decorative underline -->
			<div class="absolute bottom-0 left-1/2 transform -translate-x-1/2
                  w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500
                  rounded-full transition-all duration-300
                  group-hover:w-32 group-hover:h-1.5"></div>
		</div>
	{/if}
</div>