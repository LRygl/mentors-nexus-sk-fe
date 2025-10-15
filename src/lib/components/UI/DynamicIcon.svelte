<script lang="ts">

	import type { Component } from 'svelte';
	import { getIconComponent } from '$lib/types/params/iconRegistry';
	import { HelpCircle } from '@lucide/svelte';

	interface Props {
		iconName: string | Component | null | undefined;
		class?: string;
		size?: number;
		color?: string;
	}

	let {
		iconName,
		class: className = '',
		size = 16,
		color
	}: Props = $props();


	// Get the icon component, fallback to HelpCircle if not found
	let IconComponent = $state<Component>(HelpCircle);

	$effect(() => {
		if (!iconName) {
			IconComponent = HelpCircle;
			return;
		}

		// If iconName is already a component (imported from lucide-svelte)
		if (typeof iconName === 'function' || typeof iconName === 'object') {
			IconComponent = iconName as Component;
			return;
		}

		// If iconName is a string, look it up in the registry
		if (typeof iconName === 'string') {
			const foundIcon = getIconComponent(iconName);
			IconComponent = foundIcon || HelpCircle;
			return;
		}

		// Fallback
		IconComponent = HelpCircle;
	});

</script>

{#if IconComponent}
	<IconComponent
		class={className}
		size={size}
		style={color ? `color: ${color};` : ''}
	/>
{/if}